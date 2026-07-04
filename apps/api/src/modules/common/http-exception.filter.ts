import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<any>();
    const response = context.getResponse<any>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload =
      exception instanceof HttpException
        ? exception.getResponse()
        : undefined;
    const details =
      typeof payload === 'object' && payload !== null
        ? payload
        : payload
          ? { message: payload }
          : undefined;
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload
        ? payload.message
        : exception instanceof Error
          ? exception.message
          : 'Unexpected server error';
    const requestId = request.requestId;

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} failed`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      error: {
        code: this.errorCode(status),
        message,
        details,
        requestId,
      },
    });
  }

  private errorCode(status: number): string {
    if (status === HttpStatus.BAD_REQUEST) {
      return 'BAD_REQUEST';
    }
    if (status === HttpStatus.NOT_FOUND) {
      return 'NOT_FOUND';
    }
    if (status === HttpStatus.UNAUTHORIZED) {
      return 'UNAUTHORIZED';
    }
    if (status === HttpStatus.FORBIDDEN) {
      return 'FORBIDDEN';
    }
    return status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'HTTP_ERROR';
  }
}
