import { UnauthorizedException } from '@nestjs/common';
import { ErrorBody } from 'src/common/interfaces/IExceptionMessage';

export class TokenNotIssueForDeviceException extends UnauthorizedException {
  constructor() {
    super({ message: { key: 'token_not_issue_for_device' } } as ErrorBody);
    this.message = undefined;
  }
}
