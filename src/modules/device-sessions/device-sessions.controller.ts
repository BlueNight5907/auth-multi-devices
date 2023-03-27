import { Controller } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';

@Controller('device-sessions')
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}
}
