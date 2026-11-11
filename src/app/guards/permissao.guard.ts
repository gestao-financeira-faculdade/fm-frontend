import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { Role } from '../enums/role.enum';
import { AuthService } from '../services/auth.service';

/**
 * Restringe a rota às roles em `data.roles`.
 * Ex.: { path: 'auditoria', canActivate: [permissaoGuard], data: { roles: [Role.ADMIN, Role.AUDITOR] } }
 */
export const permissaoGuard: CanActivateFn = (route) => {
  const roles = route.data['roles'] as Role[] | undefined;
  if (inject(AuthService).temPermissao(roles)) return true;

  inject(MessageService).add({
    severity: 'warn',
    summary: 'Acesso negado',
    detail: 'Seu perfil não tem acesso a esta área.',
  });
  return inject(Router).createUrlTree(['/']);
};
