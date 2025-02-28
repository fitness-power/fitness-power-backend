import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        data,
      })),
    );
  }
}
