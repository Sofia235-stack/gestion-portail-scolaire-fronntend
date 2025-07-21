import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Classe, Eleve } from '../../../../../core/models';
import { AdminService } from '../../../../../core/services/admin.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import {ApiResponse} from '../../../../../core/models';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-eleve-form',
  templateUrl: './eleve-form.component.html',
  styleUrls: ['./eleve-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatProgressSpinner
  ]
})
export class EleveFormComponent implements OnInit {
  eleveForm!: FormGroup;
  isEditMode = false;
  eleveId: number | null = null;
  loading = false;
  classes: Classe[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadClasses();

    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'nouveau') {
        this.isEditMode = true;
        this.eleveId = +params['id'];
        this.loadEleve(this.eleveId);
      }
    });
  }

  initForm(): void {
    this.eleveForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dateNaissance: ['', [Validators.required]],
      classeId: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  loadEleve(id: number): void {
    this.loading = true;
    // this.adminService.getEleve(id).subscribe({
    //   next: (response: ApiResponse<void>) => {
    //     if (response.success && response.data) {
    //       const eleve = response.data;
    //       // this.eleveForm.patchValue({
    //       //   nom: eleve.nom,
    //       //   prenom: eleve.prenom,
    //       //   email: eleve.email,
    //       //   dateNaissance: eleve.dateNaissance,
    //       //   classeId: eleve.classe?.id,
    //       //   username: eleve.username
    //       // });
    //
    //       // Désactiver le champ username en mode édition
    //       this.eleveForm.get('username')?.disable();
    //     } else {
    //       this.notificationService.error('Erreur lors du chargement des données de l\'élève');
    //       this.router.navigate(['/admin/eleves']);
    //     }
    //     this.loading = false;
    //   },
    //   error: () => {
    //     this.loading = false;
    //     this.router.navigate(['/admin/eleves']);
    //   }
    // });
  }

  loadClasses(): void {
    // this.adminService.getClasses(0, 100).subscribe({
    //   next: (response: ApiResponse<void>) => {
    //     if (response.success && response.data) {
    //       // this.classes = response.data.content;
    //     }
    //   }
    // });
  }

  onSubmit(): void {
    if (this.eleveForm.invalid) {
      return;
    }

    this.loading = true;
    const eleveData = {...this.eleveForm.value};

    if (this.isEditMode && this.eleveId) {
      // Mode édition
      //   this.adminService.updateEleve(this.eleveId, eleveData).subscribe({
      //     next: (response: ApiResponse<void>) => {
      //       if (response.success) {
      //         this.notificationService.success('Élève mis à jour avec succès');
      //         this.router.navigate(['/admin/eleves']);
      //       } else {
      //         this.notificationService.error(response.message || 'Erreur lors de la mise à jour');
      //       }
      //       this.loading = false;
      //     },
      //     error: () => {
      //       this.loading = false;
      //     }
      //   });
      // } else {
      //   // Mode création
      //   this.adminService.createEleve(eleveData).subscribe({
      //     next: (response: ApiResponse<void>) => {
      //       if (response.success) {
      //         this.notificationService.success('Élève créé avec succès');
      //         this.router.navigate(['/admin/eleves']);
      //       } else {
      //         this.notificationService.error(response.message || 'Erreur lors de la création');
      //       }
      //       this.loading = false;
      //     },
      //     error: () => {
      //       this.loading = false;
      //     }
      //   });
      // }
      // }
      //
      // onCancel(): void {
      //   this.router.navigate(['/admin/eleves']);
      // }
    }
  }

  onCancel() {

  }
}
