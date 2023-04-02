import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export function AuthGuard(
  options?: Partial<{ public: boolean }>,
): Type<IAuthGuard> {
  const strategies = [];

  if (options?.public) {
    strategies.push('public');
  } else {
    strategies.push('jwt');
  }

  return NestAuthGuard(strategies);
}
