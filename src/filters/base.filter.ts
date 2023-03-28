import { TranslateOptions } from 'nestjs-i18n';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TranslationService } from './../shared/services/translation.service';

export abstract class BaseExceptionFilter<T extends Error>
  implements ExceptionFilter<T>
{
  constructor(
    protected reflector: Reflector,
    protected translationService: TranslationService,
  ) {}

  protected async translate(
    message: string,
    options?: TranslateOptions,
  ): Promise<string> {
    const key = `exception.${message}`;
    return this.translationService.translate(key, {
      defaultValue: message,
      ...options,
    });
  }

  abstract catch(exception: any, host: ArgumentsHost): void;
}
