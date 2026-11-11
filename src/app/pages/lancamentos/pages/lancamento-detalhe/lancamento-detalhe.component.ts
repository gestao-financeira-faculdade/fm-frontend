import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, forkJoin, Observable, of } from 'rxjs';

import { TIPO_LANCAMENTO_LABEL } from '../../../../enums/tipo-lancamento.enum';
import { AuthService } from '../../../../services/auth.service';
import { Categoria } from '../../../cadastros/interfaces/categoria.interface';
import { CategoriaService } from '../../../cadastros/services/categoria.service';
import { ContaService } from '../../../cadastros/services/conta.service';
import { ContraparteService } from '../../../cadastros/services/contraparte.service';
import { STATUS_EM_ABERTO, StatusLancamento } from '../../enums/status-lancamento.enum';
import { Anexo } from '../../interfaces/anexo.interface';
import { Lancamento, saldoDevedor } from '../../interfaces/lancamento.interface';
import { LiquidacaoResponse } from '../../interfaces/liquidacao.interface';
import { LANCAMENTOS_PERMISSOES } from '../../lancamentos-permissoes';
import { AnexoService } from '../../services/anexo.service';
import { LancamentoService } from '../../services/lancamento.service';

type Aba = 'resumo' | 'anexos' | 'desdobramentos' | 'historico';

@Component({
  selector: 'app-lancamento-detalhe',
  standalone: false,
  templateUrl: './lancamento-detalhe.component.html',
})
export class LancamentoDetalheComponent {
  private readonly auth = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly lancamentoService = inject(LancamentoService);
  private readonly anexoService = inject(AnexoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly contaService = inject(ContaService);
  private readonly contraparteService = inject(ContraparteService);

  /** Parâmetro de rota :id (bindToComponentInputs). */
  readonly id = input.required<string>();

  readonly permissoes = LANCAMENTOS_PERMISSOES;
  readonly tipoLabel: Record<string, string> = TIPO_LANCAMENTO_LABEL;

  readonly lancamento = signal<Lancamento | null>(null);
  readonly carregando = signal(true);
  readonly naoEncontrado = signal(false);
  readonly categoria = signal<Categoria | null>(null);
  readonly nomeConta = signal<string | null>(null);
  readonly nomeContraparte = signal<string | null>(null);

  readonly anexos = signal<Anexo[]>([]);
  readonly carregandoAnexos = signal(false);

  readonly aba = signal<Aba>('resumo');
  readonly dialogLiquidacao = signal(false);
  readonly dialogCancelamento = signal(false);
  readonly residualId = signal<string | null>(null);

  /** Muda a cada recarga para recriar as abas lazy (desdobramentos/histórico). */
  readonly versaoConteudo = signal(0);

  readonly emAberto = computed(() => {
    const l = this.lancamento();
    return !!l && STATUS_EM_ABERTO.includes(l.status);
  });
  readonly podeLiquidar = computed(() => this.emAberto() && this.auth.temPermissao(this.permissoes.liquidar));
  readonly podeCancelar = computed(() => this.emAberto() && this.auth.temPermissao(this.permissoes.cancelar));
  readonly podeAnexar = computed(
    () => this.auth.temPermissao(this.permissoes.anexar) && this.lancamento()?.status !== StatusLancamento.CANCELLED,
  );
  readonly podeVerHistorico = computed(() => this.auth.temPermissao(this.permissoes.historicoAuditoria));
  readonly saldo = computed(() => {
    const l = this.lancamento();
    return l ? saldoDevedor(l) : 0;
  });

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => {
        this.lancamento.set(null);
        this.anexos.set([]);
        this.aba.set('resumo');
        this.residualId.set(null);
        this.carregar(id);
      });
    });
  }

  recarregar(): void {
    this.carregar(this.id());
  }

  carregarAnexos(): void {
    this.carregandoAnexos.set(true);
    this.anexoService.listar(this.id()).subscribe({
      next: (anexos) => {
        this.anexos.set(anexos);
        this.carregandoAnexos.set(false);
      },
      error: () => this.carregandoAnexos.set(false),
    });
  }

  aoLiquidar(resposta: LiquidacaoResponse): void {
    const parcial = resposta.status === StatusLancamento.PARTIALLY_SETTLED;
    this.messageService.add({
      severity: 'success',
      summary: parcial ? 'Baixa parcial realizada' : 'Lançamento liquidado',
      detail: parcial ? 'Um lançamento residual foi gerado com o saldo restante.' : undefined,
    });
    this.residualId.set(resposta.residualEntryId ?? null);
    this.recarregar();
  }

  irParaAnexos(): void {
    this.aba.set('anexos');
  }

  aoTrocarAba(valor: string | number): void {
    this.aba.set(valor as Aba);
  }

  private carregar(id: string): void {
    this.carregando.set(true);
    this.naoEncontrado.set(false);
    this.lancamentoService.buscar(id).subscribe({
      next: (lancamento) => {
        this.lancamento.set(lancamento);
        this.carregando.set(false);
        this.versaoConteudo.update((v) => v + 1);
        this.carregarRelacionados(lancamento);
      },
      error: (e: { status?: number }) => {
        this.carregando.set(false);
        this.naoEncontrado.set(e.status === 404);
      },
    });
    this.carregarAnexos();
  }

  /** Categoria sempre (requiresAttachmentAlways); conta/contraparte só se o nome não veio no response. */
  private carregarRelacionados(l: Lancamento): void {
    const opcional = <T>(obs: Observable<T>) => obs.pipe(catchError(() => of(null)));
    forkJoin({
      categoria: opcional(this.categoriaService.buscar(l.categoryId)),
      conta: l.accountName ? of(null) : opcional(this.contaService.buscar(l.accountId)),
      contraparte: l.counterpartyName ? of(null) : opcional(this.contraparteService.buscar(l.counterpartyId)),
    }).subscribe(({ categoria, conta, contraparte }) => {
      this.categoria.set(categoria);
      this.nomeConta.set(l.accountName ?? conta?.name ?? null);
      this.nomeContraparte.set(l.counterpartyName ?? contraparte?.tradeName ?? contraparte?.legalName ?? null);
    });
  }
}
