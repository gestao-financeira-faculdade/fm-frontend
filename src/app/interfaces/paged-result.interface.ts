/**
 * PagedResult<T> do backend: "itens, total de elementos, página e tamanho".
 * Os nomes exatos dos campos não estão no contrato; normalizarPagina()
 * aceita tanto o formato esperado (items/totalElements) quanto o Page do Spring (content).
 */
export interface PagedResult<T> {
  items: T[];
  totalElements: number;
  page: number;
  size: number;
}

export interface Paginacao {
  page: number;
  size: number;
}

export function normalizarPagina<T>(raw: unknown): PagedResult<T> {
  const r = (raw ?? {}) as Record<string, unknown>;
  const items = (r['items'] ?? r['content'] ?? []) as T[];
  return {
    items,
    totalElements: Number(r['totalElements'] ?? r['total'] ?? items.length),
    page: Number(r['page'] ?? r['number'] ?? 0),
    size: Number(r['size'] ?? items.length),
  };
}
