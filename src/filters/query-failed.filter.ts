import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { STATUS_CODES } from 'http';
import { TranslationService } from 'src/shared/services/translation.service';
import { QueryFailedError } from 'typeorm';
import { BaseExceptionFilter } from './base.filter';

export const constraintErrors: Record<string, string> = {
  UQ_97672ac88f789774dd47f7c8be3: 'error.unique.email',
};

@Catch(QueryFailedError)
export class QueryFailedFilter extends BaseExceptionFilter<QueryFailedError> {
  constructor(reflector: Reflector, translationService: TranslationService) {
    super(reflector, translationService);
  }

  catch(
    exception: QueryFailedError & { constraint?: string },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.constraint?.startsWith('UQ')
      ? HttpStatus.CONFLICT
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message: exception.constraint
        ? constraintErrors[exception.constraint]
        : undefined,
    });
  }
}
