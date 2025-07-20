import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Récupérer l'URL de retour des paramètres de requête ou utiliser la page d'accueil par défaut
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getDefaultRoute();
    
    // Rediriger si déjà connecté
    if (this.authService.isAuthenticated) {
      this.router.navigate([this.getDefaultRoute()]);
    }
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Connexion réussie');
          this.router.navigate([this.getDefaultRoute()]);
        } else {
          this.notificationService.error(response.message || 'Erreur de connexion');
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  private getDefaultRoute(): string {
    // Rediriger vers la page appropriée selon le rôle de l'utilisateur
    if (this.authService.isAuthenticated) {
      if (this.authService.isAdmin()) {
        return '/admin';
      } else if (this.authService.isEnseignant()) {
        return '/enseignant';
      } else if (this.authService.isEleve() || this.authService.isParent()) {
        return '/eleve-parent';
      }
    }
    return '/';
  }
}