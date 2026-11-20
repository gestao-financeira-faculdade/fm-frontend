/** Erro padrão RFC 9457 (application/problem+json). */
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  /**
   * Código de negócio (ex.: MISSING_FISCAL_ATTACHMENT). O nome exato da
   * propriedade de extensão não está no contrato; ver extrairCodigoErro().
   */
  code?: string;
  errorCode?: string;
  errors?: { field?: string; message?: string }[] | Record<string, string>;
  fieldErrors?: Record<string, string>;
  [extensao: string]: unknown;
}
