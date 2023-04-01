import {
  EmailField,
  Match,
  PasswordField,
  StringField,
  Trim,
} from 'src/decorators';

export class CreateUserDto {
  @StringField({ required: true })
  @Trim()
  name: string;

  @EmailField({ required: true })
  @Trim()
  email: string;

  @PasswordField({ required: true })
  @Trim()
  password: string;

  @Match('password')
  @PasswordField({ required: true })
  @Trim()
  confirmPassword: string;
}
