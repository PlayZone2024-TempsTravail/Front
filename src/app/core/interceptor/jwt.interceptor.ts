import {HttpInterceptorFn} from '@angular/common/http';
import {UserTokenDtoModel} from "../../features/auth/models/user.token.dto.model";
import {AuthService} from "../../features/auth/services/auth.services";
import {inject} from "@angular/core";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const userToken: UserTokenDtoModel | undefined = authService.currentUser;

  if (userToken && userToken.token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${userToken.token}`)
    });
    return next(clonedRequest);
  }
  
  return next(req);
};
