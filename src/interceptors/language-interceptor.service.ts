import { TranslationService } from 'src/shared/services/translation.service';
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';

import { LanguageCode } from '../constants';
import { ContextProvider } from '../providers';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const i18n = I18nContext.current(context);
    const language: string = i18n.service.resolveLanguage(
      i18n.lang || request.headers['x-language-code'],
    );
    if (LanguageCode[language]) {
      ContextProvider.setLanguage(language);
    }
    return next.handle();
  }
}

export function UseLanguageInterceptor() {
  return UseInterceptors(LanguageInterceptor);
}
