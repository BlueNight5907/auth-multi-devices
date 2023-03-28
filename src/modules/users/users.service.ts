import { CreateUserCommand } from './commands/create-user.command';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ExistUserException } from './exceptions/exist-user.exception';
import { GetUserByEmailQuery } from './queries/get-user.query';

@Injectable()
export class UsersService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    this.commandBus.subscribe({
      next: (value) => console.debug(value, '------'),
    });
  }

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

  findOneByEmail(email: string) {
    return this.queryBus.execute<GetUserByEmailQuery, UserEntity | null>(
      new GetUserByEmailQuery(email),
    );
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
