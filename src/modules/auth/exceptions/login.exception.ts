import { UnauthorizedException } from '@nestjs/common';

export class LoginException extends UnauthorizedException {
  constructor() {
    super('login_exception');
  }
}
