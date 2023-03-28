import { CreateUserDto } from './../users/dtos/create-user.dto';
import { Body, Controller, Headers, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request as RequestType } from 'express';
import { LoginDto } from './dtos/login.dto';
import type { FingerprintResult } from 'express-fingerprint';
import { LoginMetadata } from './interfaces/login.interface';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Request() request: RequestType,
    @Body() body: LoginDto,
    @Headers() headers: Headers,
  ) {
    const fingerprint: FingerprintResult = request.fingerprint;
    const ipAddress = request.socket.remoteAddress;
    const userAgent = headers['user-agent'];
    const deviceId = fingerprint.hash;
    const metaData: LoginMetadata = { ipAddress, userAgent, deviceId };
    return { metaData, fingerprint };
  }

  @ApiQuery({ name: 'lang', required: false })
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.registerNewUser(body);
  }
}
