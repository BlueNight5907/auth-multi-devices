import { StringField } from 'src/decorators';

export class RefreshTokenDto {
  @StringField({ required: true })
  refreshToken: string;
}
