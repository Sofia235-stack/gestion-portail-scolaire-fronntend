import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Classe, Eleve, Note } from '../models';
import { environment } from '../../../app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  constructor(private http: HttpClient) {}

  // Récupérer les classes assignées à l'enseignant
  getMesClasses(): Observable<ApiResponse<Classe[]>> {
    return this.http.get<ApiResponse<Classe[]>>(`${environment.apiUrl}/enseignant/classes`);
  }

  // Récupérer les élèves d'une classe
  getElevesParClasse(classeId: number): Observable<ApiResponse<Eleve[]>> {
    return this.http.get<ApiResponse<Eleve[]>>(`${environment.apiUrl}/enseignant/classes/${classeId}/eleves`);
  }

  // Récupérer les notes d'un élève pour une matière
  getNotesEleve(eleveId: number, matiereId: number): Observable<ApiResponse<Note[]>> {
    return this.http.get<ApiResponse<Note[]>>(
      `${environment.apiUrl}/enseignant/eleves/${eleveId}/matieres/${matiereId}/notes`
    );
  }

  // Ajouter une note à un élève
  ajouterNote(note: Partial<Note>): Observable<ApiResponse<Note>> {
    return this.http.post<ApiResponse<Note>>(`${environment.apiUrl}/enseignant/notes`, note);
  }

  // Modifier une note
  modifierNote(noteId: number, note: Partial<Note>): Observable<ApiResponse<Note>> {
    return this.http.put<ApiResponse<Note>>(`${environment.apiUrl}/enseignant/notes/${noteId}`, note);
  }

  // Supprimer une note
  supprimerNote(noteId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/enseignant/notes/${noteId}`);
  }

  // Ajouter plusieurs notes en même temps (bulk)
  ajouterNotesBulk(notes: Partial<Note>[]): Observable<ApiResponse<Note[]>> {
    return this.http.post<ApiResponse<Note[]>>(`${environment.apiUrl}/enseignant/notes/bulk`, notes);
  }

  // Récupérer les statistiques pour le tableau de bord
  getStatistiques(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrl}/enseignant/statistiques`);
  }
}