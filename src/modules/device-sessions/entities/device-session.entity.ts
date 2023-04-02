import { AbstractEntity } from 'src/common/abstract.entity';
import { AbstractDtoOptions } from 'src/common/dto/abstract.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IAbstractEntity } from 'src/common/abstract.entity';
import { DeviceSessionDto } from './../dtos/device-session.dto';
import { UseDto } from 'src/decorators/use-dto.decorator';

export interface IDeviceSessionEntity
  extends IAbstractEntity<DeviceSessionDto, AbstractDtoOptions> {
  deviceId: string;
  name: string;
  ua: string;
  uaBody: Record<string, any>;
  refreshToken: string;
  expiredAt: Date;
  ipAddress: string;
  isDeleted: boolean;
  deletedId: string;
}

@Entity({ name: 'device_sessions' })
@Index(['deviceId', 'userId', 'deletedId'], { unique: true })
@UseDto(DeviceSessionDto)
export class DeviceSessionEntity
  extends AbstractEntity<DeviceSessionDto>
  implements IDeviceSessionEntity
{
  @Column({ nullable: false })
  deviceId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  ua: string;

  @Column({ type: 'json' })
  uaBody: Record<string, any>;

  @Column({ nullable: false })
  refreshToken: string;

  @Column({ nullable: false })
  expiredAt: Date;

  @Column({ nullable: false })
  ipAddress: string;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false, default: false })
  isDeleted: boolean;

  @Column({ nullable: false, default: '' })
  deletedId: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.deviceSessions)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
