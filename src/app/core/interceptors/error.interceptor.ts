import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur est survenue';
        
        // Gestion des erreurs selon le code HTTP
        switch (error.status) {
          case 400:
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Requête invalide';
            }
            break;
          case 401:
            errorMessage = 'Session expirée, veuillez vous reconnecter';
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            break;
          case 403:
            errorMessage = 'Accès non autorisé';
            this.router.navigate(['/']);
            break;
          case 404:
            errorMessage = 'Ressource non trouvée';
            break;
          case 500:
            errorMessage = 'Erreur serveur, veuillez réessayer plus tard';
            break;
          default:
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            break;
        }
        
        // Afficher la notification d'erreur
        this.notificationService.error(errorMessage);
        
        return throwError(() => error);
      })
    );
  }
}