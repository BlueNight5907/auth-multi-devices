import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Constructor } from 'src/common/types';
import { Action, CHECK_POLICIES_KEY } from 'src/constants';
import {
  AppAbility,
  Subjects,
} from 'src/shared/services/casl-ability/ability.interface';

interface IPolicyHandler {
  handle(ability: AppAbility): Promise<boolean> | boolean;
}

export abstract class AbstractPolicyHandler implements IPolicyHandler {
  abstract handle(
    ability: AppAbility,
    context?: ExecutionContext,
  ): Promise<boolean> | boolean;
}

type PolicyHandlerMap = { action: Action; subject: Subjects };

export type PolicyHandler =
  | Constructor<AbstractPolicyHandler>
  | PolicyHandlerMap;

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
