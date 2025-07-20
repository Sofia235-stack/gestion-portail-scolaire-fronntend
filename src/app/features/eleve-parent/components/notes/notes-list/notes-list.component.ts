import { Component, OnInit } from '@angular/core';
import { Note } from '../../../../../core/models';
import { EleveService } from '../../../../../core/services/eleve.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  loading = false;
  displayedColumns: string[] = ['matiere', 'valeur', 'coefficient', 'date', 'trimestre'];
  
  // Filtres
  selectedTrimestre: number | null = null;
  selectedMatiere: string | null = null;
  
  // Listes pour les filtres
  trimestres: number[] = [1, 2, 3];
  matieres: string[] = [];

  constructor(
    private eleveService: EleveService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.loading = true;
    this.eleveService.getMesNotes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.notes = response.data;
          this.extractMatieres();
        } else {
          this.notificationService.error('Erreur lors du chargement des notes');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  extractMatieres(): void {
    // Extraire les noms de matières uniques
    const matieresSet = new Set<string>();
    this.notes.forEach(note => {
      if (note.matiere && note.matiere.nom) {
        matieresSet.add(note.matiere.nom);
      }
    });
    this.matieres = Array.from(matieresSet).sort();
  }

  applyFilters(): Note[] {
    return this.notes.filter(note => {
      let matchTrimestre = true;
      let matchMatiere = true;
      
      if (this.selectedTrimestre !== null) {
        matchTrimestre = note.trimestre === this.selectedTrimestre;
      }
      
      if (this.selectedMatiere !== null) {
        matchMatiere = note.matiere.nom === this.selectedMatiere;
      }
      
      return matchTrimestre && matchMatiere;
    });
  }

  resetFilters(): void {
    this.selectedTrimestre = null;
    this.selectedMatiere = null;
  }

  getMoyenne(): number {
    const filteredNotes = this.applyFilters();
    if (filteredNotes.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCoef = 0;
    
    filteredNotes.forEach(note => {
      totalPoints += note.valeur * note.coefficient;
      totalCoef += note.coefficient;
    });
    
    return totalCoef > 0 ? totalPoints / totalCoef : 0;
  }
}