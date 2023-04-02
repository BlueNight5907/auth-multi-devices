import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserHandler } from './commands/create-user.command';
import { UserEntity } from './entities/user.entity';
import { GetUserByEmailHandler } from './queries/get-user.query';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GetUserByIdHandler } from './queries/get-user-by-id.query';

const commands = [CreateUserHandler];
const queries = [GetUserByEmailHandler, GetUserByIdHandler];
@Module({
  controllers: [UsersController],
  providers: [UsersService, ...commands, ...queries],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UsersService],
})
export class UsersModule {}
