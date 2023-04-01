import { FingerprintData } from '@shwao/express-fingerprint';
import type { Request } from 'express';

export interface IRequest extends Request {
  fingerprint: FingerprintData;
}
