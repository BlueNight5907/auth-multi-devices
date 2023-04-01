import { ContextProvider } from 'src/providers/context-provider';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Request as RequestType } from 'express';

@ApiTags('v1 - users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'lang', required: false })
  findAll(@I18n() i18n: I18nContext) {
    return {
      language: i18n.service.getSupportedLanguages(),
      lang: i18n.lang,
      translationInstance: i18n.service.translate('exception.unauthorized'),
      translation: i18n.service.translate('exception.unauthorized', {
        lang: ContextProvider.getLanguage(),
      }),
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('test2')
  test2(
    @Request() req: RequestType & { fingerprint: any },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.debug(req.fingerprint);
    return updateUserDto;
  }
}
