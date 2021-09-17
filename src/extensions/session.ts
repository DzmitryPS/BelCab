import { Record, Static, Number, Optional, Boolean } from "runtypes";
import { ParsedHttpRequest } from "../Handler";
import { RequestHandlingError } from "../RequestHandlingError";
import jwt, { Secret } from "jsonwebtoken";

const SessionType = Record({
  id: Number,
  isAdmin: Optional(Boolean),
});

export type Session = Static<typeof SessionType>;

export interface SessionRequest {
  session?: Session;
}

export interface ValidSessionRequest {
  session: Session;
}

export function signSession(jwtToken: Secret, session: Session): string {
  return jwt.sign(session, jwtToken);
}

export function session<TRequest extends ParsedHttpRequest>(
  jwtSecret: Secret,
  request: TRequest
): TRequest & SessionRequest {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return request;
  }

  let session: Session;

  try {
    session = SessionType.check(jwt.verify(authorization, jwtSecret));
  } catch (e) {
    return request;
  }

  return {
    ...request,
    session,
  };
}

export function authorized<TRequest extends SessionRequest>(
  request: TRequest,
  isAdmin?: boolean
): TRequest & ValidSessionRequest {
  const session = request.session;
  const access = isAdmin ? true : false;

  if (!session) {
    throw new RequestHandlingError("unauthorized", 401);
  }
  if (isAdmin && !session.isAdmin) {
    throw new RequestHandlingError("Access denieted", 401);
  }

  return {
    ...request,
    session,
  };
}
