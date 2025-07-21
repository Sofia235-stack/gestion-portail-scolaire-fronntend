import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/layout/components/main-layout/main-layout.component';
// import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'enseignant',
        loadChildren: () => import('./features/enseignant/enseignant.module').then(m => m.EnseignantModule)
      },
      {
        path: 'eleve-parent',
        loadChildren: () => import('./features/eleve-parent/eleve-parent.module').then(m => m.EleveParentModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
