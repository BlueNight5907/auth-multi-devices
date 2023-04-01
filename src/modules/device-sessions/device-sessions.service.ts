import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginMetadata } from '../auth/interfaces/login.interface';
import { CreateDeviceSessionCommand } from './commands/handle-device-session.command';
import { DeviceSessionEntity } from './entities/device-session.entity';
import { GetDeviceSessionQuery } from './queries/get-device-session.query';
import { GetDeviceSessionsQuery } from './queries/get-device-sessions.query';

@Injectable()
export class DeviceSessionsService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async handleDeviceSession(userId: number, metaData: LoginMetadata) {
    const { deviceId } = metaData;
    const currentDevice = await this.queryBus.execute<
      GetDeviceSessionQuery,
      DeviceSessionEntity | null
    >(new GetDeviceSessionQuery(deviceId, userId));

    const deviceSession = await this.commandBus.execute<
      CreateDeviceSessionCommand,
      DeviceSessionEntity
    >(new CreateDeviceSessionCommand(userId, metaData, currentDevice));

    return deviceSession;
  }

  getDeviceSessions(userId: number) {
    return this.queryBus.execute<GetDeviceSessionsQuery, DeviceSessionEntity[]>(
      new GetDeviceSessionsQuery(userId),
    );
  }
}
