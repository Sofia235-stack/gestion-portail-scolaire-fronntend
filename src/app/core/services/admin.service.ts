import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Eleve, Enseignant, Classe, Matiere } from '../models';
import { environment } from '../../../app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  // Gestion des élèves
  getEleves(page: number = 0, size: number = 10): Observable<ApiResponse<{ content: Eleve[], totalElements: number }>> {
    return this.http.get<ApiResponse<{ content: Eleve[], totalElements: number }>>(
      `${environment.apiUrl}/admin/eleves?page=${page}&size=${size}`
    );
  }

  getEleve(id: number): Observable<ApiResponse<Eleve>> {
    return this.http.get<ApiResponse<Eleve>>(`${environment.apiUrl}/admin/eleves/${id}`);
  }

  createEleve(eleve: Partial<Eleve>): Observable<ApiResponse<Eleve>> {
    return this.http.post<ApiResponse<Eleve>>(`${environment.apiUrl}/admin/eleves`, eleve);
  }

  updateEleve(id: number, eleve: Partial<Eleve>): Observable<ApiResponse<Eleve>> {
    return this.http.put<ApiResponse<Eleve>>(`${environment.apiUrl}/admin/eleves/${id}`, eleve);
  }

  deleteEleve(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/admin/eleves/${id}`);
  }

  // Gestion des enseignants
  getEnseignants(page: number = 0, size: number = 10): Observable<ApiResponse<{ content: Enseignant[], totalElements: number }>> {
    return this.http.get<ApiResponse<{ content: Enseignant[], totalElements: number }>>(
      `${environment.apiUrl}/admin/enseignants?page=${page}&size=${size}`
    );
  }

  getEnseignant(id: number): Observable<ApiResponse<Enseignant>> {
    return this.http.get<ApiResponse<Enseignant>>(`${environment.apiUrl}/admin/enseignants/${id}`);
  }

  createEnseignant(enseignant: Partial<Enseignant>): Observable<ApiResponse<Enseignant>> {
    return this.http.post<ApiResponse<Enseignant>>(`${environment.apiUrl}/admin/enseignants`, enseignant);
  }

  updateEnseignant(id: number, enseignant: Partial<Enseignant>): Observable<ApiResponse<Enseignant>> {
    return this.http.put<ApiResponse<Enseignant>>(`${environment.apiUrl}/admin/enseignants/${id}`, enseignant);
  }

  deleteEnseignant(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/admin/enseignants/${id}`);
  }

  // Gestion des classes
  getClasses(page: number = 0, size: number = 10): Observable<ApiResponse<{ content: Classe[], totalElements: number }>> {
    return this.http.get<ApiResponse<{ content: Classe[], totalElements: number }>>(
      `${environment.apiUrl}/admin/classes?page=${page}&size=${size}`
    );
  }

  getClasse(id: number): Observable<ApiResponse<Classe>> {
    return this.http.get<ApiResponse<Classe>>(`${environment.apiUrl}/admin/classes/${id}`);
  }

  createClasse(classe: Partial<Classe>): Observable<ApiResponse<Classe>> {
    return this.http.post<ApiResponse<Classe>>(`${environment.apiUrl}/admin/classes`, classe);
  }

  updateClasse(id: number, classe: Partial<Classe>): Observable<ApiResponse<Classe>> {
    return this.http.put<ApiResponse<Classe>>(`${environment.apiUrl}/admin/classes/${id}`, classe);
  }

  deleteClasse(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/admin/classes/${id}`);
  }

  // Gestion des matières
  getMatieres(page: number = 0, size: number = 10): Observable<ApiResponse<{ content: Matiere[], totalElements: number }>> {
    return this.http.get<ApiResponse<{ content: Matiere[], totalElements: number }>>(
      `${environment.apiUrl}/admin/matieres?page=${page}&size=${size}`
    );
  }

  getMatiere(id: number): Observable<ApiResponse<Matiere>> {
    return this.http.get<ApiResponse<Matiere>>(`${environment.apiUrl}/admin/matieres/${id}`);
  }

  createMatiere(matiere: Partial<Matiere>): Observable<ApiResponse<Matiere>> {
    return this.http.post<ApiResponse<Matiere>>(`${environment.apiUrl}/admin/matieres`, matiere);
  }

  updateMatiere(id: number, matiere: Partial<Matiere>): Observable<ApiResponse<Matiere>> {
    return this.http.put<ApiResponse<Matiere>>(`${environment.apiUrl}/admin/matieres/${id}`, matiere);
  }

  deleteMatiere(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/admin/matieres/${id}`);
  }

  // Statistiques pour le dashboard
  getDashboardStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrl}/admin/dashboard/stats`);
  }
}