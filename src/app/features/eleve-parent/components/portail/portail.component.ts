import { Component, OnInit } from '@angular/core';
import { EleveService } from '../../../../core/services/eleve.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models';

@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.scss']
})
export class PortailComponent implements OnInit {
  loading = true;
  stats: any = {};
  currentUser: User | null = null;

  constructor(
    private eleveService: EleveService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.loading = true;
    this.eleveService.getStatistiques().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
        } else {
          this.notificationService.error('Erreur lors du chargement des statistiques');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}