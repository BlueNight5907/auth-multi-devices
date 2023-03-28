import httpContext from 'express-http-context';
import { contextProviderKeys, LanguageCode } from 'src/constants';

export class ContextProvider {
  private static setUserId(value: string) {
    this.set(contextProviderKeys.USER_ID, value);
  }
  private static getUserId(): string | undefined {
    return this.get<string>(contextProviderKeys.USER_ID);
  }

  static setLanguage(language: string): void {
    ContextProvider.set(contextProviderKeys.LANGUAGE_KEY, language);
  }

  static getLanguage(): LanguageCode | undefined {
    return ContextProvider.get<LanguageCode>(contextProviderKeys.LANGUAGE_KEY);
  }

  private static set<T>(key: string, value: T) {
    httpContext.set(key, value);
  }

  private static get<T>(key: string): T | undefined {
    const value = httpContext.get(key) as T;
    if (value) {
      return value;
    }
    return undefined;
  }
}
