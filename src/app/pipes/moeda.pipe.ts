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
      f = this.criarFormatador(currency);
      this.formatadores.set(currency, f);
    }
    return f;
  }

  /** Moeda fora da ISO-4217 (dado legado) não pode derrubar a tela: cai para número com o código ao lado. */
  private criarFormatador(currency: string): Intl.NumberFormat {
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency });
    } catch {
      const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return { format: (v: number) => `${currency} ${numero.format(v)}` } as Intl.NumberFormat;
    }
  }
}
