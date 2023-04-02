import { DeviceSessionEntity } from 'src/modules/device-sessions/entities/device-session.entity';
import { IAbstractEntity } from 'src/common/abstract.entity';
import { AbstractEntity } from 'src/common/abstract.entity';

import { Column, Entity, Index, OneToMany } from 'typeorm';
import { UserDto } from '../dtos/user.dto';
import { RoleType } from 'src/constants';
import { AbstractDtoOptions } from 'src/common/dto/abstract.dto';
import { UseDto } from 'src/decorators/use-dto.decorator';

export interface IUserEntity
  extends IAbstractEntity<UserDto, AbstractDtoOptions> {
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
