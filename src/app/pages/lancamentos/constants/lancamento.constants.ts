/** Lançamentos com valor total >= este limite exigem anexo fiscal antes da liquidação. */
export const LIMITE_COMPROVANTE_OBRIGATORIO = 5000;

export const ANEXO_TIPOS_ACEITOS = ['application/pdf', 'image/jpeg', 'image/png'];
export const ANEXO_ACCEPT = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png';
export const ANEXO_TAMANHO_MAXIMO = 10 * 1024 * 1024;

/** Código ProblemDetail retornado quando falta o comprovante obrigatório. */
export const ERRO_ANEXO_OBRIGATORIO = 'MISSING_FISCAL_ATTACHMENT';

export const TAMANHO_PAGINA_PADRAO = 20;
