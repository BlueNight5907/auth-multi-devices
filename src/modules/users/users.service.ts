import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user.command';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ExistUserException } from './exceptions/exist-user.exception';
import { GetUserByEmailQuery } from './queries/get-user.query';
import { GetUserByIdQuery } from './queries/get-user-by-id.query';

@Injectable()
export class UsersService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const entity = await this.findOneByEmail(createUserDto.email);
    if (entity) {
      throw new ExistUserException(createUserDto.email);
    }
    return this.commandBus.execute<CreateUserCommand, UserEntity>(
      new CreateUserCommand(createUserDto),
    );
  }

  findAll() {
    return `This action returns all users`;
  }

  findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.queryBus.execute<GetUserByEmailQuery, UserEntity | null>(
      new GetUserByEmailQuery(email),
    );
  }

  findOneById(id: number): Promise<UserEntity | null> {
    return this.queryBus.execute<GetUserByIdQuery, UserEntity | null>(
      new GetUserByIdQuery(id),
    );
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
