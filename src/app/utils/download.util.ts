import { HttpResponse } from '@angular/common/http';

/**
 * Extrai o nome do arquivo de Content-Disposition.
 * Obs.: em chamadas cross-origin o backend precisa expor o header
 * (Access-Control-Expose-Headers: Content-Disposition).
 */
export function nomeArquivoDaResposta(resposta: HttpResponse<Blob>, padrao: string): string {
  const header = resposta.headers.get('Content-Disposition') ?? '';
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utf8) return decodeURIComponent(utf8[1].replace(/"/g, ''));
  const simples = /filename="?([^";]+)"?/i.exec(header);
  return simples ? simples[1] : padrao;
}

/** Dispara o download de um Blob no navegador. */
export function salvarBlob(blob: Blob, nomeArquivo: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function salvarResposta(resposta: HttpResponse<Blob>, padrao: string): void {
  if (!resposta.body) return;
  salvarBlob(resposta.body, nomeArquivoDaResposta(resposta, padrao));
}
