import { CanActivateFn } from '@angular/router';
import { AuthService } from "../../features/auth/services/auth.services";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser) {
    // Si l'utilisateur est connecté, on le redirige vers la page d'accueil (ou une autre page)
    router.navigate(['/']);
    return false; // Bloque l'accès à la page Login
  }
  return true; // Autorise l'accès à la page Login si l'utilisateur n'est pas connecté
};

export const unauthenticatedGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);

  if (!authService.currentUser) {
    // Si l'utilisateur n'est pas connecté, on le redirige vers Login
    router.navigate(['/login']);
    return false; // Bloque l'accès à la page protégée
  }
  return true; // Autorise l'accès si l'utilisateur est connecté
};