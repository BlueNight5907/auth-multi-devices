import { StaticTranslate } from 'src/decorators';

export class ResultMessageDto {
  @StaticTranslate({ translationKey: 'return-message' })
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
