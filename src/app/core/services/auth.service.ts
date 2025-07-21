import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse, LoginRequest, LoginResponse, User } from '../models';
import { Router } from '@angular/router';
import { environment } from '../../../app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    // this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.autoLogout(this.getTokenExpirationDate(storedToken));
    }
  }

  login(loginRequest: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.handleAuthentication(response.data);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  private handleAuthentication(authData: LoginResponse): void {
    const user = authData.user;
    user.token = authData.token;

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', authData.token);

    this.currentUserSubject.next(user);
    this.autoLogout(this.getTokenExpirationDate(authData.token));
  }

  private getTokenExpirationDate(token: string): Date {
    // Decode JWT token to get expiration date
    // This is a simplified version, in a real app you would decode the JWT
    // For now, we'll set a default expiration of 1 hour
    return new Date(new Date().getTime() + 60 * 60 * 1000);
  }

  private autoLogout(expirationDate: Date): void {
    const expirationDuration = expirationDate.getTime() - new Date().getTime();

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isEnseignant(): boolean {
    return this.hasRole('ENSEIGNANT');
  }

  isEleve(): boolean {
    return this.hasRole('ELEVE');
  }

  isParent(): boolean {
    return this.hasRole('PARENT');
  }
}
