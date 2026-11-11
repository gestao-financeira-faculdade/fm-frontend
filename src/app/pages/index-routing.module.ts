import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { permissaoGuard } from '../guards/permissao.guard';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { AUDITORIA_PERMISSOES } from './auditoria/auditoria-permissoes';

/** Rotas autenticadas, renderizadas dentro do shell (sidebar + topbar). */
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard | Gestão Financeira',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'lancamentos',
        loadChildren: () => import('./lancamentos/lancamentos.module').then((m) => m.LancamentosModule),
      },
      {
        path: 'cadastros',
        loadChildren: () => import('./cadastros/cadastros.module').then((m) => m.CadastrosModule),
      },
      {
        path: 'simulacoes',
        loadChildren: () => import('./simulacoes/simulacoes.module').then((m) => m.SimulacoesModule),
      },
      {
        path: 'relatorios',
        title: 'Relatórios | Gestão Financeira',
        loadChildren: () => import('./relatorios/relatorios.module').then((m) => m.RelatoriosModule),
      },
      {
        path: 'auditoria',
        title: 'Auditoria | Gestão Financeira',
        canActivate: [permissaoGuard],
        data: { roles: AUDITORIA_PERMISSOES.visualizar },
        loadChildren: () => import('./auditoria/auditoria.module').then((m) => m.AuditoriaModule),
      },
      {
        path: 'minha-conta',
        title: 'Minha conta | Gestão Financeira',
        loadChildren: () => import('./minha-conta/minha-conta.module').then((m) => m.MinhaContaModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexRoutingModule {}
