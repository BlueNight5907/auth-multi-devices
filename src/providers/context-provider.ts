import httpContext from 'express-http-context';
import { contextProviderKeys } from 'src/const';

export class ContextProvider {
  private static setUserId(value: string) {
    this.set(contextProviderKeys.USER_ID, value);
  }
  private static getUserId(): string | undefined {
    return this.get<string>(contextProviderKeys.USER_ID);
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
