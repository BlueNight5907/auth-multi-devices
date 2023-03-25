import {
  InternalServerErrorException,
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { STATUS_CODES } from 'http';
// catch all error
@Catch()
export default class InternalServerErrorExceptionFilter
  implements ExceptionFilter
{
  catch(exception: Error, host: ArgumentsHost) {
    const { message, stack: errStack, name: errName } = exception;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    // other error to rewirte InternalServerErrorException response
    response.status(status).json({
      statusCode: status,
      message,
      error: STATUS_CODES[status],
      errStack,
      errName,
      exception,
    });
  }
}
