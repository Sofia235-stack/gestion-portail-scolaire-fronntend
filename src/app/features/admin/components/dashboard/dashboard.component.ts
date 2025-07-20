import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgChartsModule
  ]
})
export class DashboardComponent implements OnInit {
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
  
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
  
  public pieChartType: ChartType = 'pie';
  
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.adminService.getDashboardStats().subscribe({
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
    // Initialisation du graphique à barres pour les effectifs par classe
    if (this.stats.classeStats) {
      this.barChartData = {
        labels: this.stats.classeStats.map((item: any) => item.nom),
        datasets: [
          {
            data: this.stats.classeStats.map((item: any) => item.effectif),
            label: 'Effectif par classe',
            backgroundColor: 'rgba(63, 81, 181, 0.7)',
            borderColor: 'rgba(63, 81, 181, 1)'
          }
        ]
      };
    }
    
    // Initialisation du graphique circulaire pour la répartition des rôles
    if (this.stats.roleStats) {
      this.pieChartData = {
        labels: this.stats.roleStats.map((item: any) => item.role),
        datasets: [
          {
            data: this.stats.roleStats.map((item: any) => item.count),
            backgroundColor: [
              'rgba(63, 81, 181, 0.7)',
              'rgba(103, 58, 183, 0.7)',
              'rgba(33, 150, 243, 0.7)',
              'rgba(0, 150, 136, 0.7)'
            ]
          }
        ]
      };
    }
  }
}