import { IExceptionMessage } from './../../../common/interfaces/IExceptionMessage';
import { ConflictException } from '@nestjs/common';

export class ExistUserException extends ConflictException {
  constructor(email: string) {
    super();
    const body: IExceptionMessage = { key: 'exist_user', params: { email } };
    this.message = JSON.stringify(body);
  }
}
