import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Bulletin, Note } from '../models';
import { environment } from '../../../app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EleveService {
  constructor(private http: HttpClient) {}

  // Récupérer les notes de l'élève
  getMesNotes(): Observable<ApiResponse<Note[]>> {
    return this.http.get<ApiResponse<Note[]>>(`${environment.apiUrl}/eleve/notes`);
  }

  // Récupérer les notes par matière
  getNotesParMatiere(matiereId: number): Observable<ApiResponse<Note[]>> {
    return this.http.get<ApiResponse<Note[]>>(`${environment.apiUrl}/eleve/matieres/${matiereId}/notes`);
  }

  // Récupérer les bulletins de l'élève
  getMesBulletins(): Observable<ApiResponse<Bulletin[]>> {
    return this.http.get<ApiResponse<Bulletin[]>>(`${environment.apiUrl}/eleve/bulletins`);
  }

  // Récupérer un bulletin spécifique
  getBulletin(bulletinId: number): Observable<ApiResponse<Bulletin>> {
    return this.http.get<ApiResponse<Bulletin>>(`${environment.apiUrl}/eleve/bulletins/${bulletinId}`);
  }

  // Récupérer les moyennes par trimestre
  getMoyennesParTrimestre(trimestre: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrl}/eleve/moyennes/trimestre/${trimestre}`);
  }

  // Récupérer les statistiques pour le portail
  getStatistiques(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrl}/eleve/statistiques`);
  }
}