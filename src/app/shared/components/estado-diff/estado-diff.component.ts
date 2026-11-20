import { Component, computed, input } from '@angular/core';

interface LinhaDiff {
  campo: string;
  antes: string;
  depois: string;
  alterado: boolean;
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function ehDinheiro(valor: unknown): valor is { amount: number | string; currency: string } {
  return ehObjeto(valor) && 'amount' in valor && typeof valor['currency'] === 'string';
}

function formatarDinheiro(valor: { amount: number | string; currency: string }): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: valor.currency }).format(Number(valor.amount));
}

/**
 * Compara dois snapshots (previousState / newState) campo a campo. Na baixa parcial o newState vem como
 * { settledEntry, residualChildEntry }: o lançamento liquidado é comparado com o anterior e o residual vira uma linha.
 */
@Component({
  selector: 'app-estado-diff',
  standalone: false,
  templateUrl: './estado-diff.component.html',
})
export class EstadoDiffComponent {
  readonly anterior = input<unknown>();
  readonly novo = input<unknown>();

  readonly linhas = computed<LinhaDiff[]>(() => {
    const a = this.paraObjeto(this.anterior());
    const b = this.paraObjeto(this.novo());
    const campos = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
    return campos.map((campo) => {
      const antes = this.formatar(a[campo]);
      const depois = this.formatar(b[campo]);
      return { campo, antes, depois, alterado: antes !== depois };
    });
  });

  readonly somenteAlterados = computed(() => this.linhas().filter((l) => l.alterado));

  private paraObjeto(valor: unknown): Record<string, unknown> {
    if (valor === null || valor === undefined) return {};
    if (typeof valor === 'string') {
      try {
        return this.paraObjeto(JSON.parse(valor));
      } catch {
        return { valor };
      }
    }
    if (typeof valor !== 'object') return { valor };
    const objeto = valor as Record<string, unknown>;
    if (ehObjeto(objeto['settledEntry'])) {
      const { settledEntry, residualChildEntry } = objeto as { settledEntry: Record<string, unknown>; residualChildEntry?: unknown };
      return residualChildEntry ? { ...settledEntry, residualChildEntry } : { ...settledEntry };
    }
    return objeto;
  }

  private formatar(valor: unknown): string {
    if (valor === null || valor === undefined) return '—';
    if (ehDinheiro(valor)) return formatarDinheiro(valor);
    if (ehObjeto(valor) && typeof valor['id'] === 'string' && ehDinheiro(valor['originalAmount'])) {
      return `${valor['id']} (${formatarDinheiro(valor['originalAmount'])})`;
    }
    return typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
  }
}
