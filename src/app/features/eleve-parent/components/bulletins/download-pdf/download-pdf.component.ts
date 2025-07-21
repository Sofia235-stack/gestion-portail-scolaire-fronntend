import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BulletinService } from '../../../../../core/services/bulletin.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-download-pdf',
  templateUrl: './download-pdf.component.html',
  styleUrls: ['./download-pdf.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class DownloadPdfComponent implements OnInit {
  bulletinId: number | null = null;
  loading = false;

  constructor(
    private bulletinService: BulletinService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.bulletinId = +params['id'];
        this.downloadBulletin();
      } else {
        this.router.navigate(['/eleve-parent/bulletins']);
      }
    });
  }

  downloadBulletin(): void {
    if (!this.bulletinId) return;
    
    this.loading = true;
    this.bulletinService.downloadBulletin(this.bulletinId);
    
    // Rediriger après un court délai
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/eleve-parent/bulletins', this.bulletinId]);
    }, 2000);
  }
}