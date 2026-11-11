import { Pipe, PipeTransform } from '@angular/core';

import { Money } from '../interfaces/money.interface';

/** Formata número ou Money ({ amount, currency }) como moeda pt-BR. */
@Pipe({ name: 'moeda', standalone: false })
export class MoedaPipe implements PipeTransform {
  private readonly formatadores = new Map<string, Intl.NumberFormat>();

  transform(valor: number | Money | null | undefined, moeda = 'BRL'): string {
    if (valor === null || valor === undefined) return '—';
    const amount = typeof valor === 'number' ? valor : valor.amount;
    const currency = typeof valor === 'number' ? moeda : valor.currency || moeda;
    if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—';
    return this.formatador(currency).format(Number(amount));
  }

  private formatador(currency: string): Intl.NumberFormat {
    let f = this.formatadores.get(currency);
    if (!f) {
      f = new Intl.NumberFormat('pt-BR', { style: 'currency', currency });
      this.formatadores.set(currency, f);
    }
    return f;
  }
}
