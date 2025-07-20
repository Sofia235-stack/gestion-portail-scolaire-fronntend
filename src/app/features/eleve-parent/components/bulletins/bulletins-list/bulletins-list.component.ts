import { Component, OnInit } from '@angular/core';
import { Bulletin } from '../../../../../core/models';
import { EleveService } from '../../../../../core/services/eleve.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-bulletins-list',
  templateUrl: './bulletins-list.component.html',
  styleUrls: ['./bulletins-list.component.scss']
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
      next: (response) => {
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