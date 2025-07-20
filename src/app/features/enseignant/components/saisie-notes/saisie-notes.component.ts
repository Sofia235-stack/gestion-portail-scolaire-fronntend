import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Classe, Eleve, Matiere, Note } from '../../../../core/models';
import { EnseignantService } from '../../../../core/services/enseignant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saisie-notes',
  templateUrl: './saisie-notes.component.html',
  styleUrls: ['./saisie-notes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class SaisieNotesComponent implements OnInit {
  classes: Classe[] = [];
  eleves: Eleve[] = [];
  matieres: Matiere[] = [];
  loading = false;
  
  selectedClasseId: number | null = null;
  selectedMatiereId: number | null = null;
  selectedTrimestre: number = 1;
  
  noteForm!: FormGroup;
  notes: Note[] = [];
  
  displayedColumns: string[] = ['eleve', 'note', 'commentaire', 'actions'];

  constructor(
    private enseignantService: EnseignantService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadClasses();
    
    // Récupérer les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      if (params['classeId']) {
        this.selectedClasseId = +params['classeId'];
        this.onClasseChange();
      }
    });
  }

  initForm(): void {
    this.noteForm = this.formBuilder.group({
      eleveId: ['', [Validators.required]],
      valeur: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      coefficient: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      commentaire: [''],
      date: [new Date(), [Validators.required]]
    });
  }

  loadClasses(): void {
    this.loading = true;
    this.enseignantService.getMesClasses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.classes = response.data;
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

  onClasseChange(): void {
    if (!this.selectedClasseId) return;
    
    this.loading = true;
    this.enseignantService.getElevesParClasse(this.selectedClasseId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.eleves = response.data;
        } else {
          this.notificationService.error('Erreur lors du chargement des élèves');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.noteForm.invalid || !this.selectedMatiereId || !this.selectedTrimestre) {
      return;
    }

    const noteData: Partial<Note> = {
      ...this.noteForm.value,
      matiereId: this.selectedMatiereId,
      trimestre: this.selectedTrimestre
    };

    this.loading = true;
    this.enseignantService.ajouterNote(noteData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Note ajoutée avec succès');
          this.noteForm.reset({
            coefficient: 1,
            date: new Date()
          });
          this.loadNotes();
        } else {
          this.notificationService.error(response.message || 'Erreur lors de l\'ajout de la note');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadNotes(): void {
    if (!this.selectedClasseId || !this.selectedMatiereId || !this.selectedTrimestre) {
      return;
    }

    this.loading = true;
    // Cette méthode est simplifiée, dans une vraie application il faudrait récupérer les notes par classe/matière/trimestre
    this.notes = [];
    this.loading = false;
  }

  deleteNote(noteId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.loading = true;
      this.enseignantService.supprimerNote(noteId).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Note supprimée avec succès');
            this.loadNotes();
          } else {
            this.notificationService.error(response.message || 'Erreur lors de la suppression de la note');
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}