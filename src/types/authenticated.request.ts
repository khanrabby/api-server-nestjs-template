import { ContextConfigDefault, FastifyRequest, RawRequestDefaultExpression, RawServerDefault } from "fastify";

export interface User {
  id: number;
  groups: string[];
  userId: string;
  userEmail: string;
  role: string;
}

export interface UserRawRequest extends RawRequestDefaultExpression {
  user: User;
}

// @ts-ignore
export interface AuthenticatedRequest extends FastifyRequest<any, RawServerDefault, UserRawRequest, ContextConfigDefault> {
  raw: UserRawRequest;
}
