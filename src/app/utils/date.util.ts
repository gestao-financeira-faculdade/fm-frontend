/** Date -> 'YYYY-MM-DD' no fuso local (sem o deslocamento de toISOString()). */
export function paraDataIso(data: Date | null | undefined): string | null {
  if (!data) return null;
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 'YYYY-MM-DD' -> Date local (meia-noite). */
export function deDataIso(valor: string | null | undefined): Date | null {
  if (!valor) return null;
  const [y, m, d] = valor.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Início do dia local como Instant UTC ISO 8601. */
export function inicioDoDiaUtc(data: Date | null | undefined): string | null {
  if (!data) return null;
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Fim do dia local como Instant UTC ISO 8601. */
export function fimDoDiaUtc(data: Date | null | undefined): string | null {
  if (!data) return null;
  const d = new Date(data);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

export function hojeIso(): string {
  return paraDataIso(new Date())!;
}

/** Fim do dia de hoje — use como maxDate (new Date() rejeitaria valores criados depois). */
export function fimDeHoje(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}
