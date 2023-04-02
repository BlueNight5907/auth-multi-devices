import { DeviceSessionEntity } from './entities/device-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';
import { DeviceSessionsController } from './device-sessions.controller';
import { GetDeviceSessionHandler } from './queries/get-device-session.query';
import { HandleDeviceSessionHandler } from './commands/handle-device-session.command';
import { GetDeviceSessionsHandler } from './queries/get-device-sessions.query';
import { LogoutDeviceSessionHandler } from './commands/logout-device-session.command';

const queries = [GetDeviceSessionHandler, GetDeviceSessionsHandler];
const commands = [HandleDeviceSessionHandler, LogoutDeviceSessionHandler];
@Module({
  imports: [TypeOrmModule.forFeature([DeviceSessionEntity])],
  controllers: [DeviceSessionsController],
  providers: [DeviceSessionsService, ...queries, ...commands],
  exports: [DeviceSessionsService],
})
export class DeviceSessionsModule {}
