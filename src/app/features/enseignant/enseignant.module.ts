import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnseignantRoutingModule } from './enseignant-routing.module';
import { SharedModule } from '../../shared/shared.module';
// Les composants sont maintenant standalone, pas besoin de les déclarer

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EnseignantRoutingModule,
    SharedModule
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class EnseignantModule { }