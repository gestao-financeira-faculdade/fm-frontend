/** FiscalAttachmentResponse. Nomes de campo inferidos; ver helpers abaixo. */
export interface Anexo {
  id: string;
  entryId?: string;
  fileName?: string;
  originalFilename?: string;
  contentType?: string;
  sizeBytes?: number;
  size?: number;
  uploadedAt?: string;
  createdAt?: string;
  uploadedBy?: string;
}

export function nomeAnexo(a: Anexo): string {
  return a.fileName ?? a.originalFilename ?? `anexo-${a.id}`;
}

export function tamanhoAnexo(a: Anexo): number | undefined {
  return a.sizeBytes ?? a.size;
}

export function dataAnexo(a: Anexo): string | undefined {
  return a.uploadedAt ?? a.createdAt;
}
