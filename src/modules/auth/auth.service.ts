import { DeviceSessionsService } from './../device-sessions/device-sessions.service';
import { DeviceSessionEntity } from './../device-sessions/entities/device-session.entity';
import { LoginDto } from './dtos/login.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from './../users/dtos/create-user.dto';
import { LoginMetadata, LoginPayload } from './interfaces/login.interface';
import { LoginException } from './exceptions/login.exception';
import { validateHash } from 'src/common/utils';
import { JwtService } from '@nestjs/jwt';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { NewTokenDto } from './dtos/new-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly deviceSessionService: DeviceSessionsService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { test: user.toDto() };
  }

  async signIn(body: LoginDto, metaData: LoginMetadata) {
    const user = await this.userService.findOneByEmail(body.email);
    if (!user) {
      throw new LoginException();
    }

    const isValid = await validateHash(body.password, user.password);
    if (!isValid) {
      throw new LoginException();
    }

    const deviceSession: DeviceSessionEntity =
      await this.deviceSessionService.handleDeviceSession(user.id, metaData);

    const payload: LoginPayload = {
      userId: user.id,
      deviceId: deviceSession.deviceId,
    };

    const token = this.jwtService.sign(payload);
    const loginResult = new LoginPayloadDto(user);
    loginResult.token = token;
    loginResult.refreshToken = deviceSession.refreshToken;
    return loginResult;
  }

  signOut(device: DeviceSessionEntity) {
    return this.deviceSessionService.signOut(device);
  }

  async reAuth(oldToken: string, refreshToken: string) {
    const decode = this.jwtService.verify<LoginPayload>(oldToken, {
      ignoreExpiration: true,
    });
    const { deviceId, userId } = decode;
    const deviceSession = await this.deviceSessionService.getDeviceSession(
      deviceId,
      userId,
    );

    if (
      deviceSession.refreshToken !== refreshToken ||
      deviceSession.expiredAt < new Date()
    ) {
      throw new ForbiddenException();
    }

    const payload: LoginPayload = {
      userId,
      deviceId,
    };

    const newToken = this.jwtService.sign(payload);

    return new NewTokenDto(newToken);
  }
}
