import { Exclude, instanceToPlain } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { ClassField, ClassFieldOptional, StringField } from 'src/decorators';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { DeviceSessionEntity } from '../entities/device-session.entity';

export class DeviceSessionDto extends AbstractDto {
  @StringField()
  deviceId: string;

  @StringField()
  name: string;

  @StringField()
  ua: string;

  @ClassField(() => Object)
  uaBody: Record<string, any>;

  @Exclude()
  refreshToken: string;

  @StringField()
  expiredAt: Date;

  @StringField()
  ipAddress: string;

  @StringField()
  userId: number;

  @ClassFieldOptional(() => UserDto)
  user?: UserDto;

  @Exclude()
  isDeleted: boolean;

  @Exclude()
  deletedId: string;

  constructor(entity: DeviceSessionEntity) {
    super(entity);
    this.user = entity.user?.toDto();
  }
}
