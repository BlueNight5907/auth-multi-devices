import { UserEntity } from 'src/modules/users/entities/user.entity';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Get user by id
export class GetUserByIdQuery implements IQuery {
  constructor(public id: number) {}
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
    const { id } = query;
    return this.userRepository.findOneBy({ id });
  }
}
