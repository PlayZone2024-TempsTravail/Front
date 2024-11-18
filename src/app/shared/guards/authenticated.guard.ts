import { CanActivateFn } from '@angular/router';
import { AuthService } from "../../features/auth/services/auth.services";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser) {
    return true; 
  } else {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url } // Redirige vers la page login
    });
    return false; // Bloque l'accès à la page
  }
};
