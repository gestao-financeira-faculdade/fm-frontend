import { HttpErrorResponse } from '@angular/common/http';

import { ProblemDetail } from '../interfaces/problem-detail.interface';

export function extrairProblema(erro: unknown): ProblemDetail | null {
  if (!(erro instanceof HttpErrorResponse)) return null;
  const corpo = erro.error;
  if (corpo && typeof corpo === 'object' && !(corpo instanceof Blob)) {
    return corpo as ProblemDetail;
  }
  if (typeof corpo === 'string') {
    try {
      return JSON.parse(corpo) as ProblemDetail;
    } catch {
      return { status: erro.status, detail: corpo };
    }
  }
  return { status: erro.status };
}

/** Código de negócio (ex.: MISSING_FISCAL_ATTACHMENT), procurado nos campos mais comuns. */
export function extrairCodigoErro(erro: unknown): string | null {
  const p = extrairProblema(erro);
  if (!p) return null;
  const candidatos = [p.code, p.errorCode, p['error'], p.type?.split('/').pop()];
  for (const c of candidatos) {
    if (typeof c !== 'string') continue;
    const normalizado = c.toUpperCase().replace(/-/g, '_');
    if (/^[A-Z]+(?:_[A-Z]+)+$/.test(normalizado)) return normalizado;
  }
  // Último recurso: o código aparece no texto do detail/title
  const m = /\b([A-Z]+(?:_[A-Z]+)+)\b/.exec(`${p.detail ?? ''} ${p.title ?? ''}`);
  return m ? m[1] : null;
}

const MENSAGENS_STATUS: Record<number, string> = {
  0: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  400: 'Requisição inválida. Verifique os dados informados.',
  403: 'Você não tem permissão para executar esta ação.',
  404: 'Registro não encontrado.',
  409: 'O registro foi alterado por outro usuário. Recarregue e tente novamente.',
  422: 'A operação viola uma regra de negócio.',
  503: 'Serviço temporariamente indisponível. Tente novamente em instantes.',
};

export function mensagemErro(erro: unknown): string {
  const p = extrairProblema(erro);
  const status = erro instanceof HttpErrorResponse ? erro.status : 0;
  if (p?.errors) {
    const lista = Array.isArray(p.errors)
      ? p.errors.map((e) => e.message).filter(Boolean)
      : Object.values(p.errors);
    if (lista.length) return lista.join(' • ');
  }
  return p?.detail || p?.title || MENSAGENS_STATUS[status] || 'Ocorreu um erro inesperado.';
}
