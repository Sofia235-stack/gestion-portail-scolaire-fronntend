import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  
  const requiredRole = route.data['role'] as string;
  
  if (authService.isAuthenticated && authService.hasRole(requiredRole)) {
    return true;
  }
  
  notificationService.error('Vous n\'avez pas les droits nécessaires pour accéder à cette page');
  
  // Rediriger vers la page appropriée selon le rôle de l'utilisateur
  if (authService.isAuthenticated) {
    if (authService.isAdmin()) {
      router.navigate(['/admin']);
    } else if (authService.isEnseignant()) {
      router.navigate(['/enseignant']);
    } else if (authService.isEleve() || authService.isParent()) {
      router.navigate(['/eleve-parent']);
    } else {
      router.navigate(['/']);
    }
  } else {
    router.navigate(['/auth/login']);
  }
  
  return false;
};