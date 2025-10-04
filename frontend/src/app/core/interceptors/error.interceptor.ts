import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe({
    error: (err: HttpErrorResponse) => {
      if (err.status === 401) {
        router.navigate(['/auth']);
      }
      throw err;
    }
  } as any);
};
