export interface Anexo {
  id: string;
  entryId: string;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  sha256Checksum: string;
  uploadedBy: string;
  uploadedAt: string;
}

export function nomeAnexo(a: Anexo): string {
  return a.originalFileName || `anexo-${a.id}`;
}

export function tamanhoAnexo(a: Anexo): number | undefined {
  return a.fileSizeBytes;
}

export function dataAnexo(a: Anexo): string | undefined {
  return a.uploadedAt;
}
