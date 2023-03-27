import { HidePropertyValue, StringField } from 'src/decorators';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends AbstractDto {
  @StringField()
  name: string;

  @StringField()
  email: string;

  @HidePropertyValue()
  password: string;

  @HidePropertyValue()
  salt: string;

  constructor(entity: UserEntity) {
    super(entity);
  }
}
