export interface LoginMetadata {
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  userAgentBody: Record<string, any>;
}

export interface LoginPayload {
  userId: number;
  deviceId: string;
  iat?: number;
  exp?: number;
}
