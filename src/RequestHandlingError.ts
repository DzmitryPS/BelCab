export class RequestHandlingError extends Error {
  constructor(
    message: string,
    public readonly errorCode = 400,
    public readonly additionalErrorCode?: number
  ) {
    super(message);
  }
}
