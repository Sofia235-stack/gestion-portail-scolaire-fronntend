import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Matiere, Enseignant } from '../../../../../core/models';
import { AdminService } from '../../../../../core/services/admin.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {SharedModule} from '../../../../../shared/shared.module';
import {ApiResponse} from '../../../../../core/models';

@Component({
  selector: 'app-enseignant-form',
  templateUrl: './enseignant-form.component.html',
  styleUrls: ['./enseignant-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SharedModule
  ]
})
export class EnseignantFormComponent implements OnInit {
  enseignantForm!: FormGroup;
  isEditMode = false;
  enseignantId: number | null = null;
  loading = false;
  matieres: Matiere[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadMatieres();

    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'nouveau') {
        this.isEditMode = true;
        this.enseignantId = +params['id'];
        this.loadEnseignant(this.enseignantId);
      }
    });
  }

  initForm(): void {
    this.enseignantForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      matiereIds: [[], [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  loadEnseignant(id: number): void {
    this.loading = true;
    this.adminService.getEnseignant(id).subscribe({
      next: (response: ApiResponse<Enseignant>) => {
        if (response.success && response.data) {
          const enseignant = response.data;
          this.enseignantForm.patchValue({
            nom: enseignant.nom,
            prenom: enseignant.prenom,
            email: enseignant.email,
            matiereIds: enseignant.matieres?.map(m => m.id) || [],
            username: enseignant.username
          });

          // Désactiver le champ username en mode édition
          this.enseignantForm.get('username')?.disable();
        } else {
          this.notificationService.error('Erreur lors du chargement des données de l\'enseignant');
          this.router.navigate(['/admin/enseignants']);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/admin/enseignants']);
      }
    });
  }

  loadMatieres(): void {
    this.adminService.getMatieres(0, 100).subscribe({
      // next: (response: ApiResponse<Enseignant>) => {
      //   if (response.success && response.data) {
      //     this.matieres = response.data.content;
      //   }
      // }
    });
  }

  onSubmit(): void {
    if (this.enseignantForm.invalid) {
      return;
    }

    this.loading = true;
    const enseignantData = { ...this.enseignantForm.value };

    if (this.isEditMode && this.enseignantId) {
      // Mode édition
      this.adminService.updateEnseignant(this.enseignantId, enseignantData).subscribe({
        next: (response: ApiResponse<Enseignant>) => {
          if (response.success) {
            this.notificationService.success('Enseignant mis à jour avec succès');
            this.router.navigate(['/admin/enseignants']);
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
      this.adminService.createEnseignant(enseignantData).subscribe({
        next: (response: ApiResponse<Enseignant>) => {
          if (response.success) {
            this.notificationService.success('Enseignant créé avec succès');
            this.router.navigate(['/admin/enseignants']);
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

  onCancel(): void {
    this.router.navigate(['/admin/enseignants']);
  }
}
