import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TreeNode } from 'primeng/api';

import { NoDesdobramento } from '../../interfaces/lancamento.interface';
import { LancamentoService } from '../../services/lancamento.service';

/** Árvore de desdobramentos: lançamento raiz, baixas parciais e resíduos gerados. */
@Component({
  selector: 'app-desdobramentos-lancamento',
  standalone: false,
  templateUrl: './desdobramentos-lancamento.component.html',
})
export class DesdobramentosLancamentoComponent implements OnInit {
  private readonly lancamentoService = inject(LancamentoService);

  readonly lancamentoId = input.required<string>();

  readonly arvore = signal<TreeNode<NoDesdobramento>[]>([]);
  readonly carregando = signal(true);

  ngOnInit(): void {
    this.lancamentoService.desdobramentos(this.lancamentoId()).subscribe({
      next: (nos) => {
        this.arvore.set(this.paraArvore(nos));
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  /** Aceita tanto lista aninhada (children) quanto lista plana com parentId. */
  private paraArvore(nos: NoDesdobramento[]): TreeNode<NoDesdobramento>[] {
    const aninhada = nos.some((n) => n.children?.length);
    if (aninhada) {
      const mapear = (n: NoDesdobramento): TreeNode<NoDesdobramento> => ({
        key: n.id,
        data: n,
        expanded: true,
        children: (n.children ?? []).map(mapear),
      });
      return nos.map(mapear);
    }

    const porId = new Map<string, TreeNode<NoDesdobramento>>();
    nos.forEach((n) => porId.set(n.id, { key: n.id, data: n, expanded: true, children: [] }));
    const raizes: TreeNode<NoDesdobramento>[] = [];
    nos.forEach((n) => {
      const no = porId.get(n.id)!;
      const pai = n.parentId ?? n.parentEntryId;
      if (pai && porId.has(pai)) porId.get(pai)!.children!.push(no);
      else raizes.push(no);
    });
    return raizes;
  }
}
