import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortailComponent } from './components/portail/portail.component';
import { BulletinsListComponent } from './components/bulletins/bulletins-list/bulletins-list.component';
import { BulletinDetailComponent } from './components/bulletins/bulletin-detail/bulletin-detail.component';
import { NotesListComponent } from './components/notes/notes-list/notes-list.component';
import { roleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portail',
    pathMatch: 'full'
  },
  {
    path: 'portail',
    component: PortailComponent,
    canActivate: [roleGuard],
    data: { role: ['ELEVE', 'PARENT'] }
  },
  {
    path: 'bulletins',
    component: BulletinsListComponent,
    canActivate: [roleGuard],
    data: { role: ['ELEVE', 'PARENT'] }
  },
  {
    path: 'bulletins/:id',
    component: BulletinDetailComponent,
    canActivate: [roleGuard],
    data: { role: ['ELEVE', 'PARENT'] }
  },
  {
    path: 'notes',
    component: NotesListComponent,
    canActivate: [roleGuard],
    data: { role: ['ELEVE', 'PARENT'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EleveParentRoutingModule { }