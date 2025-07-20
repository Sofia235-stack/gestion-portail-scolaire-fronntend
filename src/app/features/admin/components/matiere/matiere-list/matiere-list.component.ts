import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Matiere } from '../../../core/models';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-matiere-list',
  templateUrl: './matiere-list.component.html',
  styleUrls: ['./matiere-list.component.scss'],
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
    MatSortModule,
    MatTableModule
  ]
})
export class MatiereListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nom', 'coefficient', 'actions'];
  dataSource = new MatTableDataSource<Matiere>([]);
  loading = false;
  totalElements = 0;
  
  // Pour le formulaire d'ajout/édition
  editMode = false;
  currentMatiere: Partial<Matiere> = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadMatieres();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadMatieres(page: number = 0, size: number = 10): void {
    this.loading = true;
    this.adminService.getMatieres(page, size).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dataSource.data = response.data.content;
          this.totalElements = response.data.totalElements;
        } else {
          this.notificationService.error('Erreur lors du chargement des matières');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.loadMatieres(event.pageIndex, event.pageSize);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openMatiereForm(matiere?: Matiere): void {
    if (matiere) {
      this.editMode = true;
      this.currentMatiere = { ...matiere };
    } else {
      this.editMode = false;
      this.currentMatiere = {};
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentMatiere = {};
  }

  saveMatiere(matiere: Partial<Matiere>): void {
    if (!matiere.nom || !matiere.coefficient) {
      this.notificationService.error('Veuillez remplir tous les champs');
      return;
    }

    this.loading = true;
    
    if (this.editMode && matiere.id) {
      // Mode édition
      this.adminService.updateMatiere(matiere.id, matiere).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Matière mise à jour avec succès');
            this.loadMatieres(this.paginator.pageIndex, this.paginator.pageSize);
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
      this.adminService.createMatiere(matiere).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Matière créée avec succès');
            this.loadMatieres(this.paginator.pageIndex, this.paginator.pageSize);
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

  deleteMatiere(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      this.adminService.deleteMatiere(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Matière supprimée avec succès');
            this.loadMatieres(this.paginator.pageIndex, this.paginator.pageSize);
          } else {
            this.notificationService.error(response.message || 'Erreur lors de la suppression');
          }
        }
      });
    }
  }
}