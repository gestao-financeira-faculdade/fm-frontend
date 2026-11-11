/**
 * Mesma paleta de tailwind.config.js, para uso a partir do TypeScript
 * (preset do PrimeNG, cores dos gráficos). Mantenha os dois em sincronia.
 */
export const CORES_MARCA = {
  50: '#eef6ff',
  100: '#d9eaff',
  200: '#bcdaff',
  300: '#8ec3ff',
  400: '#59a2ff',
  500: '#337dfc',
  600: '#1d5ef1',
  700: '#1549de',
  800: '#183db4',
  900: '#1a378e',
  950: '#152356',
} as const;

export const CORES = {
  marca: CORES_MARCA,
  receita: '#059669',
  despesa: '#dc2626',
  alerta: '#d97706',
  neutro: '#64748b',
} as const;

/** Converte hex (#rrggbb) em rgba com a opacidade informada. */
export function comOpacidade(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
