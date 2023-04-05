import { StringField } from 'src/decorators';

export class NewTokenDto {
  @StringField({ required: true })
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
