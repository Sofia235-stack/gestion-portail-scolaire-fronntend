import { Component, OnInit } from '@angular/core';
import { EnseignantService } from '../../../../core/services/enseignant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-tableau-bord',
  templateUrl: './tableau-bord.component.html',
  styleUrls: ['./tableau-bord.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, RouterLink, NgChartsModule]
})
export class TableauBordComponent implements OnInit {
  loading = true;
  stats: any = {};
  
  // Configuration des graphiques
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  
  public barChartType: ChartType = 'bar';
  
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor(
    private enseignantService: EnseignantService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.loading = true;
    this.enseignantService.getStatistiques().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
          this.initCharts();
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

  private initCharts(): void {
    // Initialisation du graphique à barres pour les moyennes par classe
    if (this.stats.moyennesParClasse) {
      this.barChartData = {
        labels: this.stats.moyennesParClasse.map((item: any) => item.classe),
        datasets: [
          {
            data: this.stats.moyennesParClasse.map((item: any) => item.moyenne),
            label: 'Moyenne par classe',
            backgroundColor: 'rgba(63, 81, 181, 0.7)',
            borderColor: 'rgba(63, 81, 181, 1)'
          }
        ]
      };
    }
  }
}