import httpContext from 'express-http-context';
import { contextProviderKeys, LanguageCode } from 'src/constants';
import { LoginPayload } from 'src/modules/auth/interfaces/login.interface';

export class ContextProvider {
  static getPolicyResult<T>(value: T) {
    this.set(contextProviderKeys.POLICY_RESULT, value);
  }

  static setPolicyResult<T>(): T | undefined {
    return this.get<T>(contextProviderKeys.POLICY_RESULT);
  }

  static setPayload(value: LoginPayload) {
    this.set(contextProviderKeys.PAYLOAD, value);
  }

  static getPayload(): LoginPayload | undefined {
    return this.get<LoginPayload>(contextProviderKeys.PAYLOAD);
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
