import { normalizarPagina } from './paged-result.interface';

describe('normalizarPagina', () => {
  it('aceita o formato items/totalElements', () => {
    const p = normalizarPagina<number>({ items: [1, 2], totalElements: 10, page: 1, size: 2 });
    expect(p).toEqual({ items: [1, 2], totalElements: 10, page: 1, size: 2 });
  });

  it('aceita o Page do Spring (content/number)', () => {
    const p = normalizarPagina<number>({ content: [1], totalElements: 5, number: 2, size: 1 });
    expect(p).toEqual({ items: [1], totalElements: 5, page: 2, size: 1 });
  });
});
