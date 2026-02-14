import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { DialogService } from '@components/shared/dialog.component/dialog.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialog = inject(DialogService);

  return next(req).pipe(
    catchError((err: unknown) => {
      const message = messageOf(err);

      dialog.alert({
        title: 'Error',
        message,
        type: 'error',
      });

      console.error('[HTTP ERROR]', req.method, req.url, err);
      return throwError(() => err);
    })
  );
};

function messageOf(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Ocurrió un error inesperado.';

  const backendMsg =
    typeof err.error === 'string'
      ? err.error
      : (err.error?.message ?? err.message);

  return backendMsg ?? `Error ${err.status}`;
}
