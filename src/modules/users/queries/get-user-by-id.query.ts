import { UserEntity } from 'src/modules/users/entities/user.entity';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Get user by id
export class GetUserByIdQuery implements IQuery {
  constructor(public id: number, public deviceId?: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler
  implements IQueryHandler<GetUserByIdQuery, UserEntity | null>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  execute(query: GetUserByIdQuery): Promise<UserEntity | null> {
    const { id, deviceId } = query;
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id });
    if (deviceId) {
      queryBuilder
        .leftJoinAndSelect('user.deviceSessions', 'deviceSession')
        .andWhere('deviceSession.deviceId = :deviceId', { deviceId })
        .andWhere('deviceSession.isDeleted = FALSE');
    }
    return queryBuilder.getOne();
  }
}
