import { Component, inject, OnInit, signal } from '@angular/core';

import { AuthService } from '../../services/auth.service';

/** Shell autenticado: sidebar (fixa no desktop, drawer no mobile) + topbar + router-outlet. */
@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  private readonly auth = inject(AuthService);

  readonly menuMobileAberto = signal(false);

  ngOnInit(): void {
    // Atualiza nome/perfil do usuário a partir do backend (role pode ter mudado).
    this.auth.me().subscribe({ error: () => undefined });
  }
}
