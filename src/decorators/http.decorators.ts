import {
  createParamDecorator,
  ExecutionContext,
  Param,
  ParseUUIDPipe,
  PipeTransform,
} from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';

export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user?.[Symbol.for('isPublic')]) {
      return;
    }
    return user;
  })();
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
