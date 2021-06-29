import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogContentComponent } from './shared/dialog-content/dialog-content.component';

@Injectable()
export class AuthorizeInterceptor implements HttpInterceptor {
  constructor(
    @Inject('userInput') public params,
    public dialog: MatDialog
  ) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.params.authToken}`,
      },
    });
    return next.handle(request).pipe(
      tap(
        (data: any) => {
          if (data instanceof HttpResponse) {
            return data;
          }
          return null;
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.dialog.open(DialogContentComponent, {
                data: { name: 'session time out. Please login again' },
              });
            }
          }
          return throwError(error);
        }
      )
    );
  }
}
