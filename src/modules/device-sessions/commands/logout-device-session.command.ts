import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { DeviceSessionEntity } from '../entities/device-session.entity';

export class LogoutDeviceSessionCommand implements ICommand {
  constructor(public device: DeviceSessionEntity) {}
}

@CommandHandler(LogoutDeviceSessionCommand)
export class LogoutDeviceSessionHandler
  implements ICommandHandler<LogoutDeviceSessionCommand, DeviceSessionEntity>
{
  constructor(
    @InjectRepository(DeviceSessionEntity)
    private readonly dsRepository: Repository<DeviceSessionEntity>,
  ) {}
  execute(command: LogoutDeviceSessionCommand): Promise<DeviceSessionEntity> {
    const { device } = command;
    device.deletedId = v4();
    device.isDeleted = true;
    return this.dsRepository.save(device);
  }
}
