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

/** Mensagens em pt-BR para os códigos de negócio do backend, que devolve o detail em inglês. */
export const MENSAGENS_ERRO: Record<string, string> = {
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos.',
  USER_INACTIVE: 'Usuário inativo. Procure um administrador.',
  TOO_MANY_LOGIN_ATTEMPTS: 'Muitas tentativas de login sem sucesso. Aguarde alguns minutos e tente novamente.',
  INVALID_REFRESH_TOKEN: 'Sua sessão expirou. Entre novamente.',
  ACCESS_DENIED: 'Você não tem permissão para executar esta ação.',
  UNDERPAYMENT_REQUIRES_SPLIT: 'O valor pago é menor que o saldo. Marque "Permitir baixa parcial" para gerar o residual.',
  MISSING_FISCAL_ATTACHMENT: 'Anexe o comprovante fiscal antes de liquidar este lançamento.',
  INVALID_SETTLEMENT_DATE: 'A data de liquidação não pode ser futura.',
  INVALID_SETTLEMENT_AMOUNT: 'Valor de liquidação inválido.',
  CONCURRENCY_CONFLICT: 'O lançamento foi alterado por outra pessoa. Recarregue a página e tente de novo.',
  PRECONDITION_FAILED: 'O registro mudou desde que foi carregado. Recarregue a página e tente de novo.',
  ENTRY_AMOUNT_ABOVE_LIMIT: 'O valor excede o máximo permitido por lançamento (R$ 10.000.000,00).',
  CURRENCY_MISMATCH: 'A moeda do lançamento precisa ser a mesma da conta.',
  IDEMPOTENCY_KEY_REUSED: 'Esta requisição já foi usada para outro lançamento. Recarregue o formulário e envie de novo.',
  ACCOUNT_NOT_FOUND: 'A conta informada não existe.',
  CATEGORY_NOT_FOUND: 'A categoria informada não existe.',
  COUNTERPARTY_NOT_FOUND: 'A contraparte informada não existe.',
  INACTIVE_ACCOUNT: 'A conta está inativa.',
  INACTIVE_CATEGORY: 'A categoria está inativa.',
  INACTIVE_COUNTERPARTY: 'A contraparte está inativa.',
  INCOMPATIBLE_CATEGORY_TYPE: 'A categoria não aceita este tipo de lançamento.',
  ENTRY_ALREADY_CANCELLED: 'O lançamento já está cancelado.',
  CANNOT_CANCEL_SETTLED_ENTRY: 'Lançamentos liquidados não podem ser cancelados.',
  ENTRY_HAS_ACTIVE_CHILDREN: 'Cancele antes o lançamento residual gerado pela baixa parcial.',
  INVALID_CANCELLATION_REASON: 'Descreva o motivo do cancelamento (mínimo de 5 caracteres).',
  ENTRY_CANCELLED: 'Não é possível anexar arquivos a um lançamento cancelado.',
  ATTACHMENT_TOO_LARGE: 'O arquivo excede o limite de 10 MB.',
  INVALID_ATTACHMENT_FORMAT: 'Envie apenas PDF, JPEG ou PNG.',
  INVALID_ATTACHMENT_SIZE: 'O arquivo está vazio ou excede o limite de 10 MB.',
  DUPLICATE_ACCOUNT_NAME: 'Já existe uma conta com este nome.',
  DUPLICATE_CATEGORY: 'Já existe uma categoria com este nome e tipo.',
  DUPLICATE_CATEGORY_NAME: 'Já existe uma categoria com este nome e tipo.',
  DUPLICATE_COUNTERPARTY_TAX_ID: 'Já existe uma contraparte com este CPF/CNPJ.',
  INVALID_TAX_ID: 'CPF ou CNPJ inválido.',
  INVALID_SIMULATION_HORIZON: 'O horizonte da simulação deve ser de 30, 60 ou 90 dias.',
  INSUFFICIENT_SIMULATION_SCENARIOS: 'A simulação precisa de pelo menos 100.000 cenários.',
  EXCESSIVE_SIMULATION_SCENARIOS: 'A simulação aceita no máximo 1.000.000 de cenários.',
  INVALID_RANDOM_SEED: 'A semente deve ser um número inteiro positivo.',
  SIMULATION_AMOUNT_OUT_OF_RANGE: 'Há valores grandes demais para a simulação. Revise os lançamentos em aberto.',
  RISK_ENGINE_UNAVAILABLE: 'O motor de simulação está indisponível. Tente novamente em instantes.',
  DATA_INTEGRITY_VIOLATION: 'A operação conflita com dados já cadastrados.',
  MALFORMED_REQUEST_BODY: 'Os dados enviados estão em formato inválido.',
  INVALID_PARAMETER: 'Um dos parâmetros informados é inválido.',
  RESOURCE_NOT_FOUND: 'Registro não encontrado.',
  NOT_FOUND: 'Registro não encontrado.',
  INTERNAL_ERROR: 'Ocorreu um erro inesperado no servidor.',
};

const MENSAGENS_STATUS: Record<number, string> = {
  0: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  400: 'Requisição inválida. Verifique os dados informados.',
  403: 'Você não tem permissão para executar esta ação.',
  404: 'Registro não encontrado.',
  409: 'O registro foi alterado por outro usuário. Recarregue e tente novamente.',
  422: 'A operação viola uma regra de negócio.',
  503: 'Serviço temporariamente indisponível. Tente novamente em instantes.',
};

const ROTULOS_CAMPO: Record<string, string> = {
  name: 'Nome',
  legalName: 'Razão social',
  tradeName: 'Nome fantasia',
  taxId: 'CPF/CNPJ',
  description: 'Descrição',
  originalAmount: 'Valor',
  dueDate: 'Vencimento',
  competenceDate: 'Competência',
  reason: 'Motivo',
  paidAmount: 'Valor pago',
  currency: 'Moeda',
  categoryId: 'Categoria',
  accountId: 'Conta',
  counterpartyId: 'Contraparte',
  entryType: 'Tipo',
  status: 'Status',
  id: 'Identificador',
  page: 'Página',
  size: 'Tamanho da página',
};

const TEXTOS_CAMPO: Record<string, string> = {
  'invalid value': 'valor inválido',
};

function rotuloCampo(campo: string): string {
  const ultimo = campo.split('.').pop() ?? campo;
  return ROTULOS_CAMPO[ultimo] ?? ultimo;
}

export function mensagemErro(erro: unknown): string {
  const p = extrairProblema(erro);
  const status = erro instanceof HttpErrorResponse ? erro.status : 0;
  const campos = Object.entries(p?.fieldErrors ?? {});
  if (campos.length) {
    return campos.map(([campo, msg]) => `${rotuloCampo(campo)}: ${TEXTOS_CAMPO[msg] ?? msg}`).join(' • ');
  }
  const codigo = extrairCodigoErro(erro);
  if (codigo && MENSAGENS_ERRO[codigo]) {
    return MENSAGENS_ERRO[codigo];
  }
  if (p?.errors) {
    const lista = Array.isArray(p.errors)
      ? p.errors.map((e) => e.message).filter(Boolean)
      : Object.values(p.errors);
    if (lista.length) return lista.join(' • ');
  }
  return p?.detail || p?.title || MENSAGENS_STATUS[status] || 'Ocorreu um erro inesperado.';
}
