import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, forkJoin, of } from 'rxjs';

import { TIPO_LANCAMENTO_LABEL, TIPO_LANCAMENTO_OPCOES, TipoLancamento } from '../../../../enums/tipo-lancamento.enum';
import { deDataIso, paraDataIso } from '../../../../utils/date.util';
import { salvarResposta } from '../../../../utils/download.util';
import { Categoria } from '../../../cadastros/interfaces/categoria.interface';
import { ContaFinanceira } from '../../../cadastros/interfaces/conta.interface';
import { CategoriaService } from '../../../cadastros/services/categoria.service';
import { ContaService } from '../../../cadastros/services/conta.service';
import { TAMANHO_PAGINA_PADRAO } from '../../constants/lancamento.constants';
import { STATUS_LANCAMENTO_OPCOES, StatusLancamento } from '../../enums/status-lancamento.enum';
import { FiltroLancamento, LancamentoResumo } from '../../interfaces/lancamento.interface';
import { LANCAMENTOS_PERMISSOES } from '../../lancamentos-permissoes';
import { LancamentoService } from '../../services/lancamento.service';

@Component({
  selector: 'app-lancamento-lista',
  standalone: false,
  templateUrl: './lancamento-lista.component.html',
})
export class LancamentoListaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly lancamentoService = inject(LancamentoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly contaService = inject(ContaService);

  readonly permissoes = LANCAMENTOS_PERMISSOES;
  readonly tipoOpcoes = TIPO_LANCAMENTO_OPCOES;
  readonly tipoLabel: Record<string, string> = TIPO_LANCAMENTO_LABEL;
  readonly statusOpcoes = STATUS_LANCAMENTO_OPCOES;
  readonly linhas = signal(TAMANHO_PAGINA_PADRAO);

  readonly categorias = signal<Categoria[]>([]);
  readonly contas = signal<ContaFinanceira[]>([]);

  readonly lancamentos = signal<LancamentoResumo[]>([]);
  readonly total = signal(0);
  readonly falhaNaBusca = signal(false);
  readonly carregando = signal(false);
  readonly primeiro = signal(0);
  readonly exportando = signal(false);

  readonly filtros = this.fb.group({
    search: [''],
    entryType: [null as TipoLancamento | null],
    status: [null as StatusLancamento | null],
    categoryId: [null as string | null],
    accountId: [null as string | null],
    periodo: this.fb.control<Date[] | null>(null),
  });

  readonly itensExportacao: MenuItem[] = [
    { label: 'Exportar CSV', icon: 'pi pi-file-excel', command: () => this.exportar('csv') },
    { label: 'Exportar PDF', icon: 'pi pi-file-pdf', command: () => this.exportar('pdf') },
  ];

  private filtroAplicado: FiltroLancamento = {};
  private tamanho = TAMANHO_PAGINA_PADRAO;

  ngOnInit(): void {
    this.restaurarDaUrl(this.route.snapshot.queryParams);
    forkJoin({
      categorias: this.categoriaService.listar().pipe(catchError(() => of([]))),
      contas: this.contaService.listar().pipe(catchError(() => of([]))),
    }).subscribe(({ categorias, contas }) => {
      this.categorias.set(categorias);
      this.contas.set(contas);
    });
  }

  aoCarregar(evento: TableLazyLoadEvent): void {
    const first = evento.first ?? 0;
    this.tamanho = evento.rows ?? TAMANHO_PAGINA_PADRAO;
    this.linhas.set(this.tamanho);
    this.primeiro.set(first);
    this.buscar(Math.floor(first / this.tamanho));
  }

  filtrar(): void {
    this.filtroAplicado = this.montarFiltro();
    this.primeiro.set(0);
    this.buscar(0);
  }

  limpar(): void {
    this.filtros.reset();
    this.filtrar();
  }

  abrir(lancamento: LancamentoResumo): void {
    void this.router.navigate(['/lancamentos', lancamento.id]);
  }

  exportar(formato: 'csv' | 'pdf'): void {
    this.exportando.set(true);
    this.lancamentoService.exportar(formato, this.montarFiltro()).subscribe({
      next: (resposta) => {
        salvarResposta(resposta, `lancamentos.${formato}`);
        this.exportando.set(false);
      },
      error: () => this.exportando.set(false),
    });
  }

  private buscar(pagina: number): void {
    this.sincronizarUrl(pagina);
    this.carregando.set(true);
    this.falhaNaBusca.set(false);
    this.lancamentoService.listar(this.filtroAplicado, { page: pagina, size: this.tamanho }).subscribe({
      next: (resultado) => {
        this.lancamentos.set(resultado.items);
        this.total.set(resultado.totalElements);
        this.carregando.set(false);
      },
      error: () => {
        this.lancamentos.set([]);
        this.total.set(0);
        this.falhaNaBusca.set(true);
        this.carregando.set(false);
      },
    });
  }

  private montarFiltro(): FiltroLancamento {
    const v = this.filtros.getRawValue();
    const [inicio, fim] = v.periodo ?? [];
    return {
      search: v.search?.trim() || null,
      entryType: v.entryType,
      status: v.status,
      categoryId: v.categoryId,
      accountId: v.accountId,
      dueDateFrom: paraDataIso(inicio),
      dueDateTo: paraDataIso(fim ?? inicio),
    };
  }

  /** Filtros e página ficam na URL para sobreviver a recarregar e a voltar do detalhe. */
  private sincronizarUrl(pagina: number): void {
    const f = this.filtroAplicado;
    const queryParams: Params = {
      search: f.search || null,
      entryType: f.entryType || null,
      status: f.status || null,
      categoryId: f.categoryId || null,
      accountId: f.accountId || null,
      de: f.dueDateFrom || null,
      ate: f.dueDateTo || null,
      page: pagina > 0 ? pagina : null,
      size: this.tamanho !== TAMANHO_PAGINA_PADRAO ? this.tamanho : null,
    };
    void this.router.navigate([], { relativeTo: this.route, queryParams, replaceUrl: true });
  }

  private restaurarDaUrl(params: Params): void {
    const data = (valor: unknown) => (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor) ? deDataIso(valor) : null);
    const inicio = data(params['de']);
    const fim = data(params['ate']);
    this.filtros.patchValue({
      search: params['search'] ?? '',
      entryType: params['entryType'] ?? null,
      status: params['status'] ?? null,
      categoryId: params['categoryId'] ?? null,
      accountId: params['accountId'] ?? null,
      periodo: inicio ? [inicio, ...(fim ? [fim] : [])] : null,
    });
    this.filtroAplicado = this.montarFiltro();
    const tamanho = Number(params['size']);
    const pagina = Number(params['page']);
    this.tamanho = Number.isInteger(tamanho) && tamanho > 0 ? tamanho : TAMANHO_PAGINA_PADRAO;
    this.linhas.set(this.tamanho);
    this.primeiro.set(Number.isInteger(pagina) && pagina > 0 ? pagina * this.tamanho : 0);
  }
}
