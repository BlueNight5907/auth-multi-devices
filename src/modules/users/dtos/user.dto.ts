import { Exclude } from 'class-transformer';
import { StringField } from 'src/decorators';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends AbstractDto {
  @StringField()
  name: string;

  @StringField()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  constructor(entity: UserEntity) {
    super(entity);
  }
}
