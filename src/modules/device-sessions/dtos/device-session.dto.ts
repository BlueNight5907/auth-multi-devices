import { AbstractDto } from 'src/common/dto/abstract.dto';
import { ClassField, StringField } from 'src/decorators';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { DeviceSessionEntity } from '../entities/device-session.entity';

export class DeviceSessionDto extends AbstractDto {
  @StringField()
  deviceId: string;

  @StringField()
  name: string;

  @StringField()
  ua: string;

  @StringField()
  secrectKey: string;

  @StringField()
  refreshToken: string;

  @StringField()
  expiredAt: Date;

  @StringField()
  ipAddress: string;

  @StringField()
  userId: number;

  @ClassField(() => UserDto)
  user: UserDto;

  constructor(entity: DeviceSessionEntity) {
    super(entity);
    this.user = entity.user.toDto();
  }
}
