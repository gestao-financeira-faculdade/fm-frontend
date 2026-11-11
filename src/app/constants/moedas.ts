import { Opcao } from '../interfaces/money.interface';

export const MOEDA_PADRAO = 'BRL';

export const MOEDAS: Opcao<string>[] = [
  { label: 'BRL — Real', value: 'BRL' },
  { label: 'USD — Dólar', value: 'USD' },
  { label: 'EUR — Euro', value: 'EUR' },
];
