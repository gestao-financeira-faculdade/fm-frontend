import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { ROLE_LABEL } from '../../../../enums/role.enum';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-minha-conta',
  standalone: false,
  templateUrl: './minha-conta.component.html',
})
export class MinhaContaComponent implements OnInit {
  private readonly auth = inject(AuthService);

  readonly usuario = this.auth.usuario;
  readonly carregando = signal(true);
  readonly perfil = computed(() => {
    const role = this.usuario()?.role;
    return role ? ROLE_LABEL[role] : '—';
  });

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: () => this.carregando.set(false),
      error: () => this.carregando.set(false),
    });
  }

  sair(): void {
    this.auth.logout();
  }
}
