import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError, forkJoin, of } from 'rxjs';

import { TIPO_LANCAMENTO_OPCOES, TipoLancamento } from '../../../../enums/tipo-lancamento.enum';
import { paraDataIso } from '../../../../utils/date.util';
import { salvarResposta } from '../../../../utils/download.util';
import { Categoria } from '../../../cadastros/interfaces/categoria.interface';
import { ContaFinanceira } from '../../../cadastros/interfaces/conta.interface';
import { CategoriaService } from '../../../cadastros/services/categoria.service';
import { ContaService } from '../../../cadastros/services/conta.service';
import { STATUS_LANCAMENTO_OPCOES, StatusLancamento } from '../../../lancamentos/enums/status-lancamento.enum';
import { FORMATO_RELATORIO_OPCOES, FormatoRelatorio } from '../../enums/formato-relatorio.enum';
import { RelatorioService } from '../../services/relatorio.service';

@Component({
  selector: 'app-exportacao-relatorio',
  standalone: false,
  templateUrl: './exportacao-relatorio.component.html',
})
export class ExportacaoRelatorioComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly relatorioService = inject(RelatorioService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly contaService = inject(ContaService);
  private readonly messageService = inject(MessageService);

  readonly formatos = FORMATO_RELATORIO_OPCOES;
  readonly tipoOpcoes = TIPO_LANCAMENTO_OPCOES;
  readonly statusOpcoes = STATUS_LANCAMENTO_OPCOES;

  readonly categorias = signal<Categoria[]>([]);
  readonly contas = signal<ContaFinanceira[]>([]);
  readonly gerando = signal(false);

  readonly form = this.fb.group({
    format: [FormatoRelatorio.CSV],
    entryType: [null as TipoLancamento | null],
    status: [null as StatusLancamento | null],
    categoryId: [null as string | null],
    accountId: [null as string | null],
    periodo: this.fb.control<Date[] | null>(null),
    search: [''],
  });

  ngOnInit(): void {
    forkJoin({
      categorias: this.categoriaService.listar().pipe(catchError(() => of([]))),
      contas: this.contaService.listar().pipe(catchError(() => of([]))),
    }).subscribe(({ categorias, contas }) => {
      this.categorias.set(categorias);
      this.contas.set(contas);
    });
  }

  selecionarFormato(formato: FormatoRelatorio): void {
    this.form.controls.format.setValue(formato);
  }

  limpar(): void {
    this.form.reset({ format: this.form.controls.format.value });
  }

  gerar(): void {
    const v = this.form.getRawValue();
    const formato = v.format ?? FormatoRelatorio.CSV;
    const [inicio, fim] = v.periodo ?? [];
    this.gerando.set(true);
    this.relatorioService
      .exportarLancamentos(formato, {
        entryType: v.entryType,
        status: v.status,
        categoryId: v.categoryId,
        accountId: v.accountId,
        dueDateFrom: paraDataIso(inicio),
        dueDateTo: paraDataIso(fim ?? inicio),
        search: v.search?.trim() || null,
      })
      .subscribe({
        next: (resposta) => {
          salvarResposta(resposta, `relatorio-financeiro.${formato.toLowerCase()}`);
          this.messageService.add({ severity: 'success', summary: 'Relatório gerado', detail: `Download do ${formato} iniciado.` });
          this.gerando.set(false);
        },
        error: () => this.gerando.set(false),
      });
  }
}
