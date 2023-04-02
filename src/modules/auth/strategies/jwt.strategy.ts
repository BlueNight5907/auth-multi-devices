import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { TokenNotIssueForDeviceException } from '../exceptions/token-not-issued-for-device.exception';
import { LoginPayload } from '../interfaces/login.interface';
import { IRequest } from 'src/common/interfaces';
import { ContextProvider } from 'src/providers';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: apiConfigService.authConfig.publicKey,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(request: IRequest, payload: LoginPayload) {
    const { fingerprint } = request;
    if (fingerprint.hash !== payload.deviceId) {
      throw new TokenNotIssueForDeviceException();
    }

    const user = await this.userService.findOneById(payload.userId);
    if (!user) {
      throw new TokenNotIssueForDeviceException();
    }

    ContextProvider.setPayload(payload);
    return user;
  }
}
