import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { addSeconds } from 'date-fns';
import randomatic from 'randomatic';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { Repository } from 'typeorm';
import { LoginMetadata } from 'src/modules/auth/interfaces/login.interface';
import { DeviceSessionEntity } from '../entities/device-session.entity';

export class CreateDeviceSessionCommand implements ICommand {
  constructor(
    public userId: number,
    public metaData: LoginMetadata,
    public currentDevice?: DeviceSessionEntity,
  ) {}
}

@CommandHandler(CreateDeviceSessionCommand)
export class HandleDeviceSessionHandler
  implements ICommandHandler<CreateDeviceSessionCommand, DeviceSessionEntity>
{
  constructor(
    @InjectRepository(DeviceSessionEntity)
    private readonly dsRepository: Repository<DeviceSessionEntity>,
    private readonly apiConfigService: ApiConfigService,
  ) {}
  async execute(
    command: CreateDeviceSessionCommand,
  ): Promise<DeviceSessionEntity> {
    const { userId, metaData, currentDevice } = command;
    const { deviceId, ipAddress, userAgent, userAgentBody } = metaData;
    const newDevice = new DeviceSessionEntity();
    if (currentDevice) {
      newDevice.id = currentDevice.id;
    }
    newDevice.expiredAt = addSeconds(
      new Date(),
      this.apiConfigService.authConfig.refreshTokenExpirationTime,
    );
    newDevice.deviceId = deviceId;
    newDevice.userId = userId;
    newDevice.ipAddress = ipAddress;
    newDevice.ua = userAgent;
    newDevice.uaBody = userAgentBody;
    newDevice.refreshToken = randomatic('Aa0~', 64);
    newDevice.name = deviceId;
    return this.dsRepository.save(newDevice);
  }
}
