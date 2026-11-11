import { Component, computed, inject, output } from '@angular/core';

import { MENU_PRINCIPAL } from '../../constants/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-sidebar',
  standalone: false,
  templateUrl: './nav-sidebar.component.html',
})
export class NavSidebarComponent {
  private readonly auth = inject(AuthService);

  /** Emitido ao navegar (fecha o drawer no mobile). */
  readonly navegou = output<void>();

  readonly grupos = computed(() => {
    this.auth.role(); // reavalia quando o usuário muda
    return MENU_PRINCIPAL.map((g) => ({
      ...g,
      itens: g.itens.filter((i) => this.auth.temPermissao(i.roles)),
    })).filter((g) => g.itens.length > 0);
  });
}
