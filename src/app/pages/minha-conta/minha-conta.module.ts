import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/share.module';
import { MinhaContaComponent } from './pages/minha-conta/minha-conta.component';

@NgModule({
  declarations: [MinhaContaComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: MinhaContaComponent }])],
})
export class MinhaContaModule {}
