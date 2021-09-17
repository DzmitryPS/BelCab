import { RequestHandlingError } from "./RequestHandlingError";
import { Runtype, ValidationError } from "runtypes";
import { IncomingHttpHeaders } from "http";
import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { Session } from "./extensions/session";

export type Handler<TRequest, TResponse> = (
  request: TRequest
) => Promise<TResponse>;
export type ErrorHandler<TRequest, TResponse> = (
  request: TRequest,
  error: Error
) => Promise<TResponse>;

export interface ExpressRequest {
  rawRequest: Request;
  rawResponse: Response;
}

export interface ParsedHttpRequest {
  params: Record<string, string>;
  query: ParsedQs;
  headers: IncomingHttpHeaders;
}

export interface ParsedHttpAndSession {
  params: Record<string, string>;
  query: ParsedQs;
  headers: IncomingHttpHeaders;
  session: Session;
}

export function parseHttp<TRequest extends ExpressRequest>(
  request: TRequest
): TRequest & ParsedHttpRequest {
  return {
    ...request,
    params: request.rawRequest.params,
    query: request.rawRequest.query,
    headers: request.rawRequest.headers,
  };
}

export function verify<TRequest extends ExpressRequest, TData>(
  runtype: Runtype<TData>,
  request: TRequest
): TRequest & ApiRequest<TData> {
  const data = request.rawRequest.body;

  try {
    return {
      ...request,
      data: runtype.check(data),
    };
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new RequestHandlingError(`request-data-error: ${e.message}`);
    }
    throw e;
  }
}

export async function errorHandler<TRequest, TResponse>(
  request: TRequest,
  handler: Handler<TRequest, TResponse>,
  errorHandler: ErrorHandler<TRequest, TResponse>
): Promise<TResponse> {
  try {
    return await handler(request);
  } catch (error) {
    return await errorHandler(request, error);
  }
}

export interface ApiRequest<T> {
  data: T;
}

export function apiAnswer<TResponse>(
  request: ExpressRequest,
  response: TResponse
): void {
  request.rawResponse.json({
    success: true,
    data: response,
  });
}

export async function errorApiAnswer(
  request: ExpressRequest,
  error: Error
): Promise<void> {
  if (error instanceof RequestHandlingError) {
    request.rawResponse.status(error.errorCode).json({
      success: false,
      error: error.message,
      code: error.additionalErrorCode,
    });
    return;
  }

  const errorWithStack = `An error was thrown on ${request.rawRequest.method} request to ${request.rawRequest.originalUrl}: ${error.message} ${error.stack}`;
  console.error(errorWithStack);

  request.rawResponse.status(500).json({
    success: false,
    error: "internal-server-error",
    stack: process.env.NODE_ENV === "development" ? errorWithStack : undefined,
  });
}

export async function api<TRequest extends ExpressRequest, TResponse>(
  request: TRequest,
  handler: Handler<TRequest, TResponse>
): Promise<void> {
  return await errorHandler(
    request,
    async (localRequest) =>
      apiAnswer(localRequest, await handler(localRequest)),
    errorApiAnswer
  );
}
