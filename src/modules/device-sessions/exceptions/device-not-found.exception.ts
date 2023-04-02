import { NotFoundException } from '@nestjs/common';

export class DeviceNotFoundException extends NotFoundException {
  constructor() {
    super('device_not_found');
  }
}
