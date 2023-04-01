import { UserEntity } from 'src/modules/users/entities/user.entity';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetUserByEmailQuery implements IQuery {
  constructor(public email: string) {}
}

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery, UserEntity | null>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  execute(query: GetUserByEmailQuery): Promise<UserEntity | null> {
    const { email } = query;
    return this.userRepository.findOneBy({ email });
  }
}
