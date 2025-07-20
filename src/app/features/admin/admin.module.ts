import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EleveListComponent } from './components/eleve/eleve-list/eleve-list.component';
import { EleveFormComponent } from './components/eleve/eleve-form/eleve-form.component';
import { EnseignantListComponent } from './components/enseignant/enseignant-list/enseignant-list.component';
import { EnseignantFormComponent } from './components/enseignant/enseignant-form/enseignant-form.component';
import { MatiereListComponent } from './components/matiere/matiere-list/matiere-list.component';
import { ClasseListComponent } from './components/classe/classe-list/classe-list.component';

// Import Chart.js directement
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    DashboardComponent,
    EleveListComponent,
    EleveFormComponent,
    EnseignantListComponent,
    EnseignantFormComponent,
    MatiereListComponent,
    ClasseListComponent
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class AdminModule { }