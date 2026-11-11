import { NgModule } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

import { NavSidebarComponent } from '../components/nav-sidebar/nav-sidebar.component';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { SharedModule } from '../shared/share.module';
import { IndexRoutingModule } from './index-routing.module';

/** Shell autenticado. Cada área de negócio é um módulo lazy filho. */
@NgModule({
  declarations: [MainLayoutComponent, NavSidebarComponent, TopbarComponent],
  imports: [SharedModule, DrawerModule, IndexRoutingModule],
})
export class IndexModule {}
