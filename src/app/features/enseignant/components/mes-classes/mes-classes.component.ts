import { Component, OnInit } from '@angular/core';
import { Classe } from '../../../../core/models';
import { EnseignantService } from '../../../../core/services/enseignant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mes-classes',
  templateUrl: './mes-classes.component.html',
  styleUrls: ['./mes-classes.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, RouterLink]
})
export class MesClassesComponent implements OnInit {
  classes: Classe[] = [];
  loading = false;
  selectedClasse: Classe | null = null;

  constructor(
    private enseignantService: EnseignantService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    this.enseignantService.getMesClasses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.classes = response.data;
          if (this.classes.length > 0) {
            this.selectClasse(this.classes[0]);
          }
        } else {
          this.notificationService.error('Erreur lors du chargement des classes');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectClasse(classe: Classe): void {
    this.selectedClasse = classe;
  }

  getEffectif(classe: Classe): number {
    return classe.eleves?.length || 0;
  }
}