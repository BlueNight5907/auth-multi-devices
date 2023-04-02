import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  Param,
  ParseUUIDPipe,
  PipeTransform,
  UseGuards,
} from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/dto/roles.dto';
import { Action, RoleType } from 'src/constants';
import { AuthGuard } from 'src/guards/auth.guard';
import { PoliciesGuard } from 'src/guards/policies.guard';
import { AppAbility } from 'src/shared/services/casl-ability/ability.interface';
import { CheckPolicies, PolicyHandler } from './policy.decorator';
import { PublicRoute } from './public-route.decorator';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{
    public: boolean;
    handlers: PolicyHandler[];
  }>,
): MethodDecorator {
  const isPublicRoute = options?.public;
  const handlers = options?.handlers ?? [];

  const checkRoles: PolicyHandler = {
    action: Action.Access,
    subject: new Roles(roles),
  };

  return applyDecorators(
    PublicRoute(isPublicRoute),
    CheckPolicies(checkRoles, ...handlers),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    UseGuards(AuthGuard({ public: isPublicRoute }), PoliciesGuard),
  );
}
export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user;
  })();
}

export function Ability() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const ability: AppAbility = request.ability;
    return ability;
  })();
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
