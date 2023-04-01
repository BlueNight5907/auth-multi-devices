import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceSessionEntity } from './../entities/device-session.entity';

export class GetDeviceSessionQuery implements IQuery {
  constructor(
    public deviceId: string,
    public userId: number,
    public isDeleted: boolean = false,
  ) {}
}

@QueryHandler(GetDeviceSessionQuery)
export class GetDeviceSessionHandler
  implements IQueryHandler<GetDeviceSessionQuery, DeviceSessionEntity | null>
{
  constructor(
    @InjectRepository(DeviceSessionEntity)
    private readonly dsRepository: Repository<DeviceSessionEntity>,
  ) {}
  execute(query: GetDeviceSessionQuery): Promise<DeviceSessionEntity | null> {
    const { deviceId, userId, isDeleted } = query;
    return this.dsRepository.findOneBy({
      deviceId,
      userId,
      isDeleted,
    }) as Promise<DeviceSessionEntity | null>;
  }
}
