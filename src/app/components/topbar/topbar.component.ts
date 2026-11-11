import { Component, computed, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { environment } from '../../../environments/environment';
import { ROLE_LABEL } from '../../enums/role.enum';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly abrirMenu = output<void>();

  readonly usuario = this.auth.usuario;
  readonly ambiente = environment.nome === 'prod' ? null : environment.nome.toUpperCase();
  readonly perfil = computed(() => {
    const role = this.usuario()?.role;
    return role ? ROLE_LABEL[role] : '';
  });
  readonly iniciais = computed(() =>
    (this.usuario()?.fullName ?? '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join(''),
  );

  readonly itensUsuario: MenuItem[] = [
    { label: 'Minha conta', icon: 'pi pi-user', command: () => void this.router.navigate(['/minha-conta']) },
    { separator: true },
    { label: 'Sair', icon: 'pi pi-sign-out', command: () => this.auth.logout() },
  ];
}
