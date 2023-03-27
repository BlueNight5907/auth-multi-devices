import { Module } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';
import { DeviceSessionsController } from './device-sessions.controller';

@Module({
  controllers: [DeviceSessionsController],
  providers: [DeviceSessionsService]
})
export class DeviceSessionsModule {}
