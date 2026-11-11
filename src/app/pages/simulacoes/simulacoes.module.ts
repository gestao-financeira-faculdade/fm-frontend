import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/share.module';
import { NovaSimulacaoDialogComponent } from './components/nova-simulacao-dialog/nova-simulacao-dialog.component';
import { SimulacaoResultadoComponent } from './pages/simulacao-resultado/simulacao-resultado.component';

const routes: Routes = [
  { path: '', component: SimulacaoResultadoComponent, title: 'Simulações | Gestão Financeira' },
  { path: ':id', component: SimulacaoResultadoComponent, title: 'Simulação | Gestão Financeira' },
];

@NgModule({
  declarations: [SimulacaoResultadoComponent, NovaSimulacaoDialogComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SimulacoesModule {}
