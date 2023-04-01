import type { ArgumentsHost } from '@nestjs/common';
import {
  Catch,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ValidationError } from 'class-validator';
import type { Response } from 'express';
import _ from 'lodash';
import { I18nValidationException } from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';
import { ContextProvider } from 'src/providers/context-provider';
import { TranslationService } from 'src/shared/services/translation.service';
import { BaseExceptionFilter } from './base.filter';

@Catch(I18nValidationException)
export class UnprocessableEntityFilter extends BaseExceptionFilter<I18nValidationException> {
  constructor(reflector: Reflector, translationService: TranslationService) {
    super(reflector, translationService);
  }

  catch(exception: I18nValidationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = HttpStatus.UNPROCESSABLE_ENTITY;

    const validationErrors = formatI18nErrors(
      exception.errors,
      this.translationService.i18nService,
      {
        lang: ContextProvider.getLanguage(),
      },
    );

    this.validationFilter(validationErrors);

    response.status(statusCode).json({
      statusCode,
      error: new UnprocessableEntityException().message,
      message: validationErrors,
    });
  }

  private validationFilter(validationErrors: ValidationError[]): void {
    for (const validationError of validationErrors) {
      const children = validationError.children;

      if (children && !_.isEmpty(children)) {
        this.validationFilter(children);

        return;
      }

      delete validationError.children;

      const constraints = validationError.constraints;

      if (!constraints) {
        return;
      }

      for (const [constraintKey, constraint] of Object.entries(constraints)) {
        // convert default messages
        if (!constraint) {
          // convert error message to error.fields.{key} syntax for i18n translation
          constraints[constraintKey] = `error.fields.${_.snakeCase(
            constraintKey,
          )}`;
        }
      }
    }
  }
}
