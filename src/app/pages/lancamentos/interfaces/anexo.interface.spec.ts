import { Anexo, nomeAnexo, tamanhoAnexo } from './anexo.interface';

describe('anexo.interface', () => {
  const anexo: Anexo = {
    id: 'a1',
    entryId: 'e1',
    originalFileName: 'nota-fiscal.pdf',
    contentType: 'application/pdf',
    fileSizeBytes: 2048,
    sha256Checksum: 'abc',
    uploadedBy: 'u1',
    uploadedAt: '2026-11-19T10:00:00Z',
  };

  it('usa o nome e o tamanho que o backend envia', () => {
    expect(nomeAnexo(anexo)).toBe('nota-fiscal.pdf');
    expect(tamanhoAnexo(anexo)).toBe(2048);
  });
});
