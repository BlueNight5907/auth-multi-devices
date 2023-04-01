import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { ExceptionMessage } from 'src/common/interfaces/IExceptionMessage';
import { TranslationService } from 'src/shared/services/translation.service';
import { BaseExceptionFilter } from './base.filter';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter<HttpException> {
  constructor(reflector: Reflector, translationService: TranslationService) {
    super(reflector, translationService);
  }
  async catch(exception: HttpException, host: ArgumentsHost) {
    let message: string | undefined = exception.message;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (!message) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = exceptionResponse['message'] ?? '';
      }
    }

    let exceptionMessage: ExceptionMessage;
    try {
      exceptionMessage = JSON.parse(message);
    } catch (error) {
      exceptionMessage = message;
    }

    if (typeof exceptionMessage === 'string') {
      message = await this.translate(exceptionMessage);
    } else {
      message = await this.translate(exceptionMessage.key, {
        args: exceptionMessage.params,
      });
    }

    response.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message,
    });
  }
}
