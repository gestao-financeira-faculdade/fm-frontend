import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/share.module';
import { TrilhaAuditoriaComponent } from './pages/trilha-auditoria/trilha-auditoria.component';

@NgModule({
  declarations: [TrilhaAuditoriaComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: TrilhaAuditoriaComponent }])],
})
export class AuditoriaModule {}
