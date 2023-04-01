import { Action } from 'src/constants';
import { RoleAbility } from './ability.interface';
import { DeviceSessionEntity } from 'src/modules/device-sessions/entities/device-session.entity';

export class UserAbility extends RoleAbility {
  createAbility(): void {
    const { can } = this.builder;
    // All rules
    can(Action.Delete, DeviceSessionEntity, {
      userId: this.user.id,
      isDeleted: false,
    });
  }
}
