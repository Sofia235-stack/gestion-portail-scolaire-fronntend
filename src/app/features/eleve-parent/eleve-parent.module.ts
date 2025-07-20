import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EleveParentRoutingModule } from './eleve-parent-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PortailComponent } from './components/portail/portail.component';
import { BulletinsListComponent } from './components/bulletins/bulletins-list/bulletins-list.component';
import { BulletinDetailComponent } from './components/bulletins/bulletin-detail/bulletin-detail.component';
import { NotesListComponent } from './components/notes/notes-list/notes-list.component';
import { DownloadPdfComponent } from './components/bulletins/download-pdf/download-pdf.component';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EleveParentRoutingModule,
    SharedModule,
    PortailComponent,
    BulletinsListComponent,
    BulletinDetailComponent,
    NotesListComponent,
    DownloadPdfComponent
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class EleveParentModule { }