import { HttpContext, HttpContextToken } from '@angular/common/http';

/** Não anexa o Bearer token nem tenta refresh (login/refresh). */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

/**
 * Não exibe o toast global de erro. Use quando o componente trata o erro
 * por conta própria (ex.: 404 em /simulations/latest, 422 na liquidação).
 */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export function semToastDeErro(context = new HttpContext()): HttpContext {
  return context.set(SKIP_ERROR_TOAST, true);
}
