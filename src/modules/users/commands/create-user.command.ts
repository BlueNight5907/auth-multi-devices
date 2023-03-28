import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { generateHash, generateSalt } from 'src/common/utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';

export class CreateUserCommand implements ICommand {
  constructor(public userData: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, UserEntity>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const { userData } = command;
    const user = new UserEntity();
    const salt = generateSalt();
    const hash = generateHash(userData.password, salt);
    user.name = userData.name;
    user.email = userData.email;
    user.password = hash;
    user.salt = salt;
    return this.userRepository.save(user);
  }
}
