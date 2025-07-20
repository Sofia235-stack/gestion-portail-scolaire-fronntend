import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Bulletin } from '../models';
import { environment } from '../../../app/environments/environment';
import * as jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  constructor(private http: HttpClient) {}

  // Récupérer un bulletin au format PDF
  getBulletinPdf(bulletinId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/bulletins/${bulletinId}/pdf`, {
      responseType: 'blob'
    });
  }

  // Télécharger un bulletin
  downloadBulletin(bulletinId: number): void {
    this.getBulletinPdf(bulletinId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin_${bulletinId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  // Générer un bulletin pour un élève (admin/enseignant)
  genererBulletin(eleveId: number, trimestre: number): Observable<ApiResponse<Bulletin>> {
    return this.http.post<ApiResponse<Bulletin>>(
      `${environment.apiUrl}/admin/bulletins/generer`,
      { eleveId, trimestre }
    );
  }

  // Mettre à jour l'appréciation d'un bulletin
  updateAppreciation(bulletinId: number, appreciation: string): Observable<ApiResponse<Bulletin>> {
    return this.http.put<ApiResponse<Bulletin>>(
      `${environment.apiUrl}/admin/bulletins/${bulletinId}/appreciation`,
      { appreciation }
    );
  }
}