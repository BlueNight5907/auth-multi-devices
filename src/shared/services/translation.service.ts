import { Injectable } from '@nestjs/common';
import { translationKeys } from './../../constants';
import { I18nService, TranslateOptions } from 'nestjs-i18n';
import { ContextProvider } from 'src/providers/context-provider';
import { isArray, isString, map, isObject } from 'lodash';
import { ITranslationDecoratorInterface } from 'src/common/interfaces';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}
  async translate(key: string, options?: TranslateOptions): Promise<string> {
    const message: string = await this.i18n.translate(`${key}`, {
      ...options,
      defaultValue: undefined,
      lang: ContextProvider.getLanguage(),
    });

    if (key === message) {
      return this.i18n.translate(`${key}`, {
        ...options,
      });
    }

    return message;
  }

  async translateNecessaryKeys(data: unknown): Promise<any> {
    if (isObject(data) && !isArray(data)) {
      await Promise.all(
        map(data, async (value, key) => {
          if (isString(value)) {
            const translateDec: ITranslationDecoratorInterface | undefined =
              Reflect.getMetadata(
                translationKeys.STATIC_TRANSLATION_DECORATOR_KEY,
                data,
                key,
              );

            if (translateDec) {
              return this.translate(
                `${translateDec.translationKey ?? key}.${value}`,
              );
            }

            return;
          }

          if (isArray(value)) {
            return Promise.all(
              map(value, (item: any) => {
                if (isObject(item)) {
                  return this.translateNecessaryKeys(item);
                }
              }),
            );
          }

          if (isObject(value)) {
            return this.translateNecessaryKeys(value);
          }
        }),
      );
    }

    return data;
  }

  get i18nService() {
    return this.i18n;
  }
}
