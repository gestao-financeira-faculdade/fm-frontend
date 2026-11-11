import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/share.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule, LoginRoutingModule],
})
export class LoginModule {}
