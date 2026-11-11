import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ContasComponent } from './pages/contas/contas.component';
import { ContrapartesComponent } from './pages/contrapartes/contrapartes.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'contas' },
  { path: 'contas', component: ContasComponent, title: 'Contas | Gestão Financeira' },
  { path: 'categorias', component: CategoriasComponent, title: 'Categorias | Gestão Financeira' },
  { path: 'contrapartes', component: ContrapartesComponent, title: 'Contrapartes | Gestão Financeira' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastrosRoutingModule {}
