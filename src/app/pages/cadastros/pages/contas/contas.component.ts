import { Component, inject, OnInit, signal } from '@angular/core';

import { CADASTROS_PERMISSOES } from '../../cadastros-permissoes';
import { TIPO_CONTA_LABEL } from '../../enums/tipo-conta.enum';
import { ContaFinanceira } from '../../interfaces/conta.interface';
import { ContaService } from '../../services/conta.service';

@Component({
  selector: 'app-contas',
  standalone: false,
  templateUrl: './contas.component.html',
})
export class ContasComponent implements OnInit {
  private readonly contaService = inject(ContaService);

  readonly permissoes = CADASTROS_PERMISSOES;
  readonly tipoLabel = TIPO_CONTA_LABEL;
  readonly contas = signal<ContaFinanceira[]>([]);
  readonly carregando = signal(true);
  readonly dialogAberto = signal(false);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.contaService.listar().subscribe({
      next: (contas) => {
        this.contas.set(contas);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }
}
