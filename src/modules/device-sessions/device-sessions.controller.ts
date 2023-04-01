import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators';
import { ContextProvider } from 'src/providers';
import { DeviceSessionsService } from './device-sessions.service';
import { DeviceSessionDto } from './dtos/device-session.dto';
import { AbstracDtoOptions } from 'src/common/dto/abstract.dto';

@ApiTags('device-sessions')
@Controller()
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}

  @Get('/')
  @Auth([])
  async getDeviceSessions() {
    const payload = ContextProvider.getPayload();
    const deviceSessionList =
      await this.deviceSessionsService.getDeviceSessions(payload.userId);

    return deviceSessionList.toDtos<DeviceSessionDto, AbstracDtoOptions>();
  }
}
