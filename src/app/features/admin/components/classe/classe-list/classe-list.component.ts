import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiResponse, Classe } from '../../../../../core/models';
import { AdminService } from '../../../../../core/services/admin.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-classe-list',
  templateUrl: './classe-list.component.html',
  styleUrls: ['./classe-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltip
  ]
})
export class ClasseListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nom', 'niveau', 'anneeScolaire', 'effectif', 'actions'];
  dataSource = new MatTableDataSource<Classe>([]);
  loading = false;
  totalElements = 0;

  // Pour le formulaire d'ajout/édition
  editMode = false;
  currentClasse: Partial<Classe> = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClasses(page: number = 0, size: number = 10): void {
    this.loading = true;
    this.adminService.getClasses(page, size).subscribe({
      next: (response: ApiResponse<{ content: Classe[], totalElements: number }>) => {
        if (response.success && response.data) {
          this.dataSource.data = response.data.content;
          this.totalElements = response.data.totalElements;
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

  onPageChange(event: any): void {
    this.loadClasses(event.pageIndex, event.pageSize);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openClasseForm(classe?: Classe): void {
    if (classe) {
      this.editMode = true;
      this.currentClasse = { ...classe };
    } else {
      this.editMode = false;
      this.currentClasse = { anneeScolaire: new Date().getFullYear().toString() };
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentClasse = {};
  }

  saveClasse(classe: Partial<Classe>): void {
    if (!classe.nom || !classe.niveau || !classe.anneeScolaire) {
      this.notificationService.error('Veuillez remplir tous les champs');
      return;
    }

    this.loading = true;

    if (this.editMode && classe.id) {
      // Mode édition
      this.adminService.updateClasse(classe.id, classe).subscribe({
        next: (response: ApiResponse<Classe>) => {
          if (response.success) {
            this.notificationService.success('Classe mise à jour avec succès');
            this.loadClasses(this.paginator.pageIndex, this.paginator.pageSize);
            this.cancelEdit();
          } else {
            this.notificationService.error(response.message || 'Erreur lors de la mise à jour');
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      // Mode création
      this.adminService.createClasse(classe).subscribe({
        next: (response: ApiResponse<Classe>) => {
          if (response.success) {
            this.notificationService.success('Classe créée avec succès');
            this.loadClasses(this.paginator.pageIndex, this.paginator.pageSize);
            this.cancelEdit();
          } else {
            this.notificationService.error(response.message || 'Erreur lors de la création');
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  deleteClasse(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      this.adminService.deleteClasse(id).subscribe({
        next: (response: ApiResponse<void>) => {
          if (response.success) {
            this.notificationService.success('Classe supprimée avec succès');
            this.loadClasses(this.paginator.pageIndex, this.paginator.pageSize);
          } else {
            this.notificationService.error(response.message || 'Erreur lors de la suppression');
          }
        }
      });
    }
  }

  getEffectif(classe: Classe): number {
    return classe.eleves?.length || 0;
  }
}
