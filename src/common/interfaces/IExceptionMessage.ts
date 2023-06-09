export interface IExceptionMessage {
  key: string;
  params?: Record<string, string | number>;
}

export type ExceptionMessage = IExceptionMessage | string;

export interface ErrorBody {
  message: ExceptionMessage;
}
