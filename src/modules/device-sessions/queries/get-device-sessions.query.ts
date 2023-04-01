import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceSessionEntity } from '../entities/device-session.entity';

export class GetDeviceSessionsQuery implements IQuery {
  constructor(public userId: number, public isDeleted: boolean = false) {}
}

@QueryHandler(GetDeviceSessionsQuery)
export class GetDeviceSessionsHandler
  implements IQueryHandler<GetDeviceSessionsQuery, DeviceSessionEntity[]>
{
  constructor(
    @InjectRepository(DeviceSessionEntity)
    private readonly dsRepository: Repository<DeviceSessionEntity>,
  ) {}
  execute(query: GetDeviceSessionsQuery): Promise<DeviceSessionEntity[]> {
    const { userId, isDeleted } = query;
    return this.dsRepository.findBy({
      userId,
      isDeleted,
    }) as Promise<DeviceSessionEntity[]>;
  }
}
