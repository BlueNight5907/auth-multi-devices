import { StringField } from 'src/decorators';

export class LogoutDeviceDto {
  @StringField({ each: true, isArray: true })
  devices: string[];
}
