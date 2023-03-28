import { EmailField, Match, PasswordField, StringField } from 'src/decorators';

export class CreateUserDto {
  @StringField({ required: true })
  name: string;

  @EmailField({ required: true })
  email: string;

  @PasswordField({ required: true })
  password: string;

  @Match('password')
  @PasswordField({ required: true })
  confirmPassword: string;
}
