import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/share.module';
import { AnexosLancamentoComponent } from './components/anexos-lancamento/anexos-lancamento.component';
import { CancelamentoDialogComponent } from './components/cancelamento-dialog/cancelamento-dialog.component';
import { DesdobramentosLancamentoComponent } from './components/desdobramentos-lancamento/desdobramentos-lancamento.component';
import { HistoricoLancamentoComponent } from './components/historico-lancamento/historico-lancamento.component';
import { LiquidacaoDialogComponent } from './components/liquidacao-dialog/liquidacao-dialog.component';
import { StatusLancamentoTagComponent } from './components/status-lancamento-tag/status-lancamento-tag.component';
import { LancamentosRoutingModule } from './lancamentos-routing.module';
import { LancamentoDetalheComponent } from './pages/lancamento-detalhe/lancamento-detalhe.component';
import { LancamentoFormComponent } from './pages/lancamento-form/lancamento-form.component';
import { LancamentoListaComponent } from './pages/lancamento-lista/lancamento-lista.component';

@NgModule({
  declarations: [
    LancamentoListaComponent,
    LancamentoFormComponent,
    LancamentoDetalheComponent,
    StatusLancamentoTagComponent,
    LiquidacaoDialogComponent,
    CancelamentoDialogComponent,
    AnexosLancamentoComponent,
    DesdobramentosLancamentoComponent,
    HistoricoLancamentoComponent,
  ],
  imports: [SharedModule, LancamentosRoutingModule],
})
export class LancamentosModule {}
