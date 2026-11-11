import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

import { Role } from '../enums/role.enum';
import { AuthService } from '../services/auth.service';

/**
 * Renderiza o elemento apenas para as roles informadas.
 * Uso: <p-button *appPermissao="permissoes.liquidar" ... />
 *
 * Esconder na UI é conveniência; quem garante a regra é o backend (403).
 */
@Directive({ selector: '[appPermissao]', standalone: false })
export class PermissaoDirective {
  readonly appPermissao = input.required<readonly Role[]>();

  private readonly auth = inject(AuthService);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);
  private exibindo = false;

  constructor() {
    effect(() => {
      const permitido = this.auth.temPermissao(this.appPermissao());
      if (permitido && !this.exibindo) {
        this.container.createEmbeddedView(this.template);
        this.exibindo = true;
      } else if (!permitido && this.exibindo) {
        this.container.clear();
        this.exibindo = false;
      }
    });
  }
}
