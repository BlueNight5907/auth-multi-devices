import { Roles } from 'src/common/dto/roles.dto';
import { Action } from 'src/constants';
import { DeviceSessionEntity } from 'src/modules/device-sessions/entities/device-session.entity';
import { RoleAbility } from './ability.interface';

export class UserAbility extends RoleAbility {
  createAbility(): void {
    const { can } = this.builder;
    // All rules

    //Access route
    can(
      Action.Access,
      Roles,
      ({ roles }: Roles) =>
        roles.length === 0 || roles.includes(this.user.role),
    );

    can(Action.Delete, DeviceSessionEntity, {
      userId: this.user.id,
      isDeleted: false,
    });
  }
}
