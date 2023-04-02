import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY, PUBLIC_ROUTE_KEY } from 'src/constants';
import { AbstractPolicyHandler, PolicyHandler } from 'src/decorators';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { CaslAbilityFactory } from 'src/shared/services/casl-ability.factory';
import { AppAbility } from 'src/shared/services/casl-ability/ability.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const isPublicRoute =
      this.reflector.get<boolean>(PUBLIC_ROUTE_KEY, handler) ?? false;

    if (isPublicRoute) {
      return true;
    }

    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, handler) || [];

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const ability = this.caslAbilityFactory.createForUser(user as UserEntity);

    request.ability = ability;

    await policyHandlers.reduce(async (promise, handler) => {
      await promise;
      const matchRule = await this.execPolicyHandler(handler, ability, context);
      if (!matchRule) {
        throw new ForbiddenException();
      }
      return matchRule;
    }, Promise.resolve(true));

    return true;
  }

  private async execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    context: ExecutionContext,
  ) {
    if (typeof handler === 'object') {
      return ability.can(handler.action, handler.subject);
    }

    const handlerService: AbstractPolicyHandler = await this.moduleRef.create(
      handler,
    );

    return handlerService.handle(ability, context);
  }
}
