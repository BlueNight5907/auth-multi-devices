import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { TokenNotIssueForDeviceException } from '../exceptions/token-not-issued-for-device.exception';
import { LoginPayload } from '../interfaces/login.interface';
import { IRequest } from 'src/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly apiConfigService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: apiConfigService.authConfig.publicKey,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(request: IRequest, payload: LoginPayload) {
    const { fingerprint } = request;
    console.debug(fingerprint, payload.deviceId);
    if (fingerprint.hash !== payload.deviceId) {
      throw new TokenNotIssueForDeviceException();
    }
    return { userId: payload.userId, deviceId: payload.deviceId };
  }
}
