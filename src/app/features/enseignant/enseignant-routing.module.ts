import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableauBordComponent } from './components/tableau-bord/tableau-bord.component';
import { MesClassesComponent } from './components/mes-classes/mes-classes.component';
import { SaisieNotesComponent } from './components/saisie-notes/saisie-notes.component';
import { roleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tableau-bord',
    pathMatch: 'full'
  },
  {
    path: 'tableau-bord',
    component: TableauBordComponent,
    canActivate: [roleGuard],
    data: { role: 'ENSEIGNANT' }
  },
  {
    path: 'classes',
    component: MesClassesComponent,
    canActivate: [roleGuard],
    data: { role: 'ENSEIGNANT' }
  },
  {
    path: 'notes',
    component: SaisieNotesComponent,
    canActivate: [roleGuard],
    data: { role: 'ENSEIGNANT' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnseignantRoutingModule { }