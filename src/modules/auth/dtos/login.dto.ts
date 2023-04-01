import { EmailField, PasswordField } from 'src/decorators';

export class LoginDto {
  @EmailField({ required: true })
  email: string;

  @PasswordField({ required: true })
  password: string;
}
