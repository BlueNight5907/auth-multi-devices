import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from './../users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async registerNewUser(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { test: user.toDto() };
  }
}
