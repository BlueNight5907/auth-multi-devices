import { PasswordField, StringField } from 'src/decorators';

export class LoginDto {
  @StringField({ required: true })
  username: string;

  @PasswordField({ required: true })
  password: string;
}
