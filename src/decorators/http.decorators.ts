import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  Param,
  ParseUUIDPipe,
  PipeTransform,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  AuthUserDetail,
  AuthUserInterceptor,
} from 'src/interceptors/auth-user-interceptor.service';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean; userDetail: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;
  const isUserDetail = options?.userDetail ?? false;

  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    AuthUserDetail(isUserDetail),
    UseInterceptors(AuthUserInterceptor),
  );
}
export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (
      user?.[Symbol.for('isPublic')] ||
      request.user?.[Symbol.for('notUserDetail')]
    ) {
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
