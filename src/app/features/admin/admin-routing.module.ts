import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EleveListComponent } from './components/eleve/eleve-list/eleve-list.component';
import { EleveFormComponent } from './components/eleve/eleve-form/eleve-form.component';
import { EnseignantListComponent } from './components/enseignant/enseignant-list/enseignant-list.component';
import { EnseignantFormComponent } from './components/enseignant/enseignant-form/enseignant-form.component';
import { MatiereListComponent } from './components/matiere/matiere-list/matiere-list.component';
import { ClasseListComponent } from './components/classe/classe-list/classe-list.component';
import { roleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'eleves',
    component: EleveListComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'eleves/nouveau',
    component: EleveFormComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'eleves/:id',
    component: EleveFormComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'enseignants',
    component: EnseignantListComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'enseignants/nouveau',
    component: EnseignantFormComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'enseignants/:id',
    component: EnseignantFormComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'matieres',
    component: MatiereListComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'classes',
    component: ClasseListComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
