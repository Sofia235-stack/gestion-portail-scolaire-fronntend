import { Component, OnInit } from '@angular/core';
import { ApiResponse, Bulletin } from '../../../../../core/models';
import { EleveService } from '../../../../../core/services/eleve.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bulletins-list',
  templateUrl: './bulletins-list.component.html',
  styleUrls: ['./bulletins-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    DatePipe
  ]
})
export class BulletinsListComponent implements OnInit {
  bulletins: Bulletin[] = [];
  loading = false;
  displayedColumns: string[] = ['trimestre', 'anneeScolaire', 'moyenne', 'dateGeneration', 'actions'];

  constructor(
    private eleveService: EleveService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadBulletins();
  }

  loadBulletins(): void {
    this.loading = true;
    this.eleveService.getMesBulletins().subscribe({
      next: (response: ApiResponse<Bulletin[]>) => {
        if (response.success && response.data) {
          this.bulletins = response.data;
        } else {
          this.notificationService.error('Erreur lors du chargement des bulletins');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}