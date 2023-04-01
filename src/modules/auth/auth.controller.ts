import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request as RequestType } from 'express';
import { CreateUserDto } from './../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LoginMetadata } from './interfaces/login.interface';
import { IRequest } from 'src/common/interfaces';

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

  @Get('test')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  test() {
    return {};
  }

  @Get('test2')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  test2(@Request() req: RequestType & { fingerprint: any }) {
    console.debug(req.fingerprint);
    return {};
  }
}
