import {HttpInterceptorFn} from '@angular/common/http';
import {UserTokenDtoModel} from "../../features/auth/models/user.token.dto.model";
import {AuthService} from "../../features/auth/services/auth.services";
import {inject} from "@angular/core";
import {catchError, throwError} from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const userToken: UserTokenDtoModel | undefined = authService.currentUser;

  const clonedRequest = userToken && userToken.token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${userToken.token}`)
      })
    : req;

  return next(clonedRequest).pipe(
    catchError(err => {
      if (err.status === 401 || err.status === 403) {
        authService.logout();
      }
      return throwError(() => err);
    })
  );
};
