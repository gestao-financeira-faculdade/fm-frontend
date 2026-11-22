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

  private paraArvore(nos: NoDesdobramento[]): TreeNode<NoDesdobramento>[] {
    const porId = new Map<string, TreeNode<NoDesdobramento>>();
    nos.forEach((n) => porId.set(n.id, { key: n.id, data: n, expanded: true, children: [] }));
    const raizes: TreeNode<NoDesdobramento>[] = [];
    nos.forEach((n) => {
      const no = porId.get(n.id)!;
      const pai = n.parentEntryId;
      if (pai && porId.has(pai)) porId.get(pai)!.children!.push(no);
      else raizes.push(no);
    });
    return raizes;
  }
}
