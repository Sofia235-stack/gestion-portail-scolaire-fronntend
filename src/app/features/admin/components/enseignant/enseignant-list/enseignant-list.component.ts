import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Enseignant } from '../../../core/models';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-enseignant-list',
  templateUrl: './enseignant-list.component.html',
  styleUrls: ['./enseignant-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink
  ]
})
export class EnseignantListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'matieres', 'actions'];
  dataSource = new MatTableDataSource<Enseignant>([]);
  loading = false;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadEnseignants();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEnseignants(page: number = 0, size: number = 10): void {
    this.loading = true;
    this.adminService.getEnseignants(page, size).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dataSource.data = response.data.content;
          this.totalElements = response.data.totalElements;
        } else {
          this.notificationService.error('Erreur lors du chargement des enseignants');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.loadEnseignants(event.pageIndex, event.pageSize);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editEnseignant(id: number): void {
    this.router.navigate(['/admin/enseignants', id]);
  }

  deleteEnseignant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      this.adminService.deleteEnseignant(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Enseignant supprimé avec succès');
            this.loadEnseignants(this.paginator.pageIndex, this.paginator.pageSize);
          } else {
            this.notificationService.error(response.message || 'Erreur lors de la suppression');
          }
        }
      });
    }
  }

  getMatieresString(enseignant: Enseignant): string {
    if (!enseignant.matieres || enseignant.matieres.length === 0) {
      return 'Aucune matière';
    }
    return enseignant.matieres.map(m => m.nom).join(', ');
  }
}