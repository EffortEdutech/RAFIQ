import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<any>();
    const response = context.switchToHttp().getResponse<any>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${request.method} ${request.url} ${response.statusCode} ${Date.now() - startedAt}ms requestId=${request.requestId}`,
        );
      }),
      catchError((error: unknown) => {
        this.logger.warn(
          `${request.method} ${request.url} failed ${Date.now() - startedAt}ms requestId=${request.requestId}`,
        );
        return throwError(() => error);
      }),
    );
  }
}
