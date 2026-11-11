import { Component, computed, input } from '@angular/core';

interface LinhaDiff {
  campo: string;
  antes: string;
  depois: string;
  alterado: boolean;
}

/** Compara dois snapshots (previousState / newState) campo a campo. */
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
    return typeof valor === 'object' ? (valor as Record<string, unknown>) : { valor };
  }

  private formatar(valor: unknown): string {
    if (valor === null || valor === undefined) return '—';
    return typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
  }
}
