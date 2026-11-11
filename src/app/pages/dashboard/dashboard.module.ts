import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/share.module';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent, KpiCardComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: DashboardComponent }])],
})
export class DashboardModule {}
