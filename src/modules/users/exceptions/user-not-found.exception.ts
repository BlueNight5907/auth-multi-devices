import { IExceptionMessage } from 'src/common/interfaces/IExceptionMessage';
import { ConflictException } from '@nestjs/common';

export class UserNotFoundException extends ConflictException {
  constructor(email: string) {
    super();
    const body: IExceptionMessage = {
      key: 'user_not_found',
      params: { email },
    };
    this.message = JSON.stringify(body);
  }
}
