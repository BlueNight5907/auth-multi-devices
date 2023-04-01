import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { ContextProvider } from '../providers';
import { Reflector } from '@nestjs/core';
import { LoginPayload } from 'src/modules/auth/interfaces/login.interface';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

export const AUTH_USER_DETAIL_KEY = 'auth_user_detail_key';

export const AuthUserDetail = (value: boolean) =>
  SetMetadata(AUTH_USER_DETAIL_KEY, value);

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const hasUserDetail = this.reflector.get<boolean>(
      AUTH_USER_DETAIL_KEY,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();

    const payload: LoginPayload = request.user;

    ContextProvider.setPayload(payload);

    if (hasUserDetail) {
      const user: UserEntity = (await this.dataSource
        .createQueryBuilder('users', 'user')
        .where('id = :id', { id: payload.userId })
        .getOne()) as UserEntity | undefined;

      request.user = user;
    } else {
      request.user = { ...request.user, [Symbol.for('notUserDetail')]: true };
    }

    return next.handle();
  }
}
