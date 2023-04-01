import { DeviceSessionEntity } from './../../device-sessions/entities/device-session.entity';
import { IAbstractEntity } from './../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { UserDto } from '../dtos/user.dto';
import { RoleType } from 'src/constants';
import { AbstracDtoOptions } from 'src/common/dto/abstract.dto';

export interface IUserEntity
  extends IAbstractEntity<UserDto, AbstracDtoOptions> {
  name: string;
  email: string;
  password: string;
  salt: string;
}

@UseDto(UserDto)
@Entity({ name: 'users' })
@Index(['email'], { unique: true })
export class UserEntity extends AbstractEntity<UserDto> implements IUserEntity {
  @Column({ type: 'nvarchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  salt: string;

  @Column({ type: 'varchar', default: RoleType.USER, nullable: false })
  role: RoleType;

  @OneToMany(
    () => DeviceSessionEntity,
    (deviceSession: DeviceSessionEntity) => deviceSession.user,
  )
  deviceSessions: DeviceSessionEntity[];
}
