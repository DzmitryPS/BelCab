import { Request, Response } from "express";

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