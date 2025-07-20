import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bulletin, Note } from '../../../../../core/models';
import { EleveService } from '../../../../../core/services/eleve.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-bulletin-detail',
  templateUrl: './bulletin-detail.component.html',
  styleUrls: ['./bulletin-detail.component.scss']
})
export class BulletinDetailComponent implements OnInit {
  bulletin: Bulletin | null = null;
  loading = false;
  displayedColumns: string[] = ['matiere', 'moyenne', 'coefficient', 'appreciation'];
  
  // Grouper les notes par matière
  notesParMatiere: { matiere: string, moyenne: number, coefficient: number, appreciation: string }[] = [];

  constructor(
    private eleveService: EleveService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadBulletin(+params['id']);
      }
    });
  }

  loadBulletin(id: number): void {
    this.loading = true;
    this.eleveService.getBulletin(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.bulletin = response.data;
          this.processNotes();
        } else {
          this.notificationService.error('Erreur lors du chargement du bulletin');
          this.router.navigate(['/eleve-parent/bulletins']);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/eleve-parent/bulletins']);
      }
    });
  }

  processNotes(): void {
    if (!this.bulletin || !this.bulletin.notes) return;
    
    // Grouper les notes par matière
    const notesByMatiere = new Map<string, Note[]>();
    
    this.bulletin.notes.forEach(note => {
      const matiereName = note.matiere.nom;
      if (!notesByMatiere.has(matiereName)) {
        notesByMatiere.set(matiereName, []);
      }
      notesByMatiere.get(matiereName)?.push(note);
    });
    
    // Calculer la moyenne par matière
    notesByMatiere.forEach((notes, matiere) => {
      let totalPoints = 0;
      let totalCoef = 0;
      
      notes.forEach(note => {
        totalPoints += note.valeur * note.coefficient;
        totalCoef += note.coefficient;
      });
      
      const moyenne = totalCoef > 0 ? totalPoints / totalCoef : 0;
      const coefficient = notes[0]?.matiere.coefficient || 1;
      
      this.notesParMatiere.push({
        matiere,
        moyenne,
        coefficient,
        appreciation: 'Commentaire pour ' + matiere // Normalement récupéré depuis le backend
      });
    });
  }
}