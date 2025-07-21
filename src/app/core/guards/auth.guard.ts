import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   const notificationService = inject(NotificationService);
//
//   if (authService.isAuthenticated) {
//     return true;
//   }
//
//   notificationService.error('Vous devez être connecté pour accéder à cette page');
//   router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
//   return false;
// };
