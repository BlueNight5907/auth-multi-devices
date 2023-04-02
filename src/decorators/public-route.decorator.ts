import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PUBLIC_ROUTE_KEY } from 'src/constants';

export const PublicRoute = (isPublic = false): CustomDecorator =>
  SetMetadata(PUBLIC_ROUTE_KEY, isPublic);
