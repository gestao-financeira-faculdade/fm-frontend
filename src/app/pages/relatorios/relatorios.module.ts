import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/share.module';
import { ExportacaoRelatorioComponent } from './pages/exportacao-relatorio/exportacao-relatorio.component';

@NgModule({
  declarations: [ExportacaoRelatorioComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: ExportacaoRelatorioComponent }])],
})
export class RelatoriosModule {}
