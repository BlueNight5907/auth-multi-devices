import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AbstractPolicyHandler } from 'src/decorators';
import { AppAbility } from 'src/shared/services/casl-ability/ability.interface';
import { DeviceSessionsService } from '../../device-sessions/device-sessions.service';
import { ContextProvider } from 'src/providers';
import { Action } from 'src/constants';

@Injectable({ scope: Scope.REQUEST })
export class LogoutDevicePolicy extends AbstractPolicyHandler {
  constructor(private deviceSessionService: DeviceSessionsService) {
    super();
  }

  async handle(ability: AppAbility): Promise<boolean> {
    const payload = ContextProvider.getPayload();
    const deviceSession = await this.deviceSessionService.getDeviceSession(
      payload.deviceId,
      payload.userId,
    );
    if (!deviceSession) {
      throw new UnauthorizedException();
    }
    const isValid = ability.can(Action.Delete, deviceSession);

    if (isValid) {
      ContextProvider.setPolicyResult(deviceSession);
    }

    return isValid;
  }
}
