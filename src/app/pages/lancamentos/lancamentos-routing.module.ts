import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { permissaoGuard } from '../../guards/permissao.guard';
import { LANCAMENTOS_PERMISSOES } from './lancamentos-permissoes';
import { LancamentoDetalheComponent } from './pages/lancamento-detalhe/lancamento-detalhe.component';
import { LancamentoFormComponent } from './pages/lancamento-form/lancamento-form.component';
import { LancamentoListaComponent } from './pages/lancamento-lista/lancamento-lista.component';

const routes: Routes = [
  { path: '', component: LancamentoListaComponent, title: 'Lançamentos | Gestão Financeira' },
  {
    path: 'novo',
    component: LancamentoFormComponent,
    title: 'Novo lançamento | Gestão Financeira',
    canActivate: [permissaoGuard],
    data: { roles: LANCAMENTOS_PERMISSOES.criar },
  },
  { path: ':id', component: LancamentoDetalheComponent, title: 'Lançamento | Gestão Financeira' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LancamentosRoutingModule {}
