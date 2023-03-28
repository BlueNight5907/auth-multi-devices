import { IAbstractEntity } from './../../../common/abstract.entity';
import { DeviceSessionDto } from './../dtos/device-session.dto';
import { AbstractEntity } from 'src/common/abstract.entity';
import { UseDto } from 'src/decorators';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export interface IDeviceSessionEntity
  extends IAbstractEntity<DeviceSessionDto> {
  deviceId: string;
  name: string;
  ua: string;
  secrectKey: string;
  refreshToken: string;
  expiredAt: Date;
  ipAddress: string;
}

@UseDto(DeviceSessionDto)
@Entity({ name: 'device_sessions' })
@Index(['deviceId'], { unique: true })
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

  @Column({ nullable: false })
  secrectKey: string;

  @Column({ nullable: false })
  refreshToken: string;

  @Column({ nullable: false })
  expiredAt: Date;

  @Column({ nullable: false })
  ipAddress: string;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.deviceSessions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
