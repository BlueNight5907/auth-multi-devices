import { StringField } from 'src/decorators';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class LoginPayloadDto extends UserDto {
  @StringField()
  token: string;

  constructor(entity: UserEntity) {
    super(entity, { excludeFields: false });
  }
}
