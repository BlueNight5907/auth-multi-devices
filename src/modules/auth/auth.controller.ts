import {
  Body,
  Controller,
  Headers,
  Logger,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IRequest } from 'src/common/interfaces';
import { Auth } from 'src/decorators';
import { ContextProvider } from 'src/providers';
import { DeviceSessionEntity } from '../device-sessions/entities/device-session.entity';
import { CreateUserDto } from './../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LoginMetadata } from './interfaces/login.interface';
import { LogoutDevicePolicy } from './policy-handlers/logout-device-session.policy-handler';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@ApiTags('v1 - auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Request() request: IRequest,
    @Body() body: LoginDto,
    @Headers() headers: Headers,
  ) {
    const fingerprint = request.fingerprint;
    Logger.debug(fingerprint);
    const ipAddress = fingerprint.components.ip;
    const userAgent = headers['user-agent'];
    const deviceId = fingerprint.hash;
    const metaData: LoginMetadata = {
      ipAddress,
      userAgent,
      deviceId,
      userAgentBody: fingerprint.components.useragent,
    };
    return this.authService.signIn(body, metaData);
  }

  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('sign-out')
  @Auth([], { handlers: [LogoutDevicePolicy] })
  signOut() {
    const device = ContextProvider.getPolicyResult<DeviceSessionEntity>();
    return this.authService.signOut(device);
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  reAuth(@Request() request: IRequest, @Body() body: RefreshTokenDto) {
    const [_, token] = request.headers.authorization.split(' ');
    return this.authService.reAuth(token, body.refreshToken);
  }
}
