import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/share.module';
import { CadastrosRoutingModule } from './cadastros-routing.module';
import { CategoriaFormDialogComponent } from './components/categoria-form-dialog/categoria-form-dialog.component';
import { ContaFormDialogComponent } from './components/conta-form-dialog/conta-form-dialog.component';
import { ContraparteFormDialogComponent } from './components/contraparte-form-dialog/contraparte-form-dialog.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ContasComponent } from './pages/contas/contas.component';
import { ContrapartesComponent } from './pages/contrapartes/contrapartes.component';

@NgModule({
  declarations: [
    ContasComponent,
    CategoriasComponent,
    ContrapartesComponent,
    ContaFormDialogComponent,
    CategoriaFormDialogComponent,
    ContraparteFormDialogComponent,
  ],
  imports: [SharedModule, CadastrosRoutingModule],
})
export class CadastrosModule {}
