import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, forkJoin, of } from 'rxjs';

import { MOEDA_PADRAO, MOEDAS } from '../../../../constants/moedas';
import { categoriaAceitaTipo } from '../../../../enums/tipo-categoria.enum';
import { TIPO_LANCAMENTO_OPCOES, TipoLancamento } from '../../../../enums/tipo-lancamento.enum';
import { paraDataIso } from '../../../../utils/date.util';
import { gerarUuid } from '../../../../utils/uuid.util';
import { Categoria } from '../../../cadastros/interfaces/categoria.interface';
import { ContaFinanceira } from '../../../cadastros/interfaces/conta.interface';
import { Contraparte } from '../../../cadastros/interfaces/contraparte.interface';
import { CategoriaService } from '../../../cadastros/services/categoria.service';
import { ContaService } from '../../../cadastros/services/conta.service';
import { ContraparteService } from '../../../cadastros/services/contraparte.service';
import { LIMITE_COMPROVANTE_OBRIGATORIO } from '../../constants/lancamento.constants';
import { LancamentoService } from '../../services/lancamento.service';
import { valorPositivo, vencimentoAposCompetencia } from '../../validators/lancamento.validators';

@Component({
  selector: 'app-lancamento-form',
  standalone: false,
  templateUrl: './lancamento-form.component.html',
})
export class LancamentoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly lancamentoService = inject(LancamentoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly contaService = inject(ContaService);
  private readonly contraparteService = inject(ContraparteService);

  readonly tipoOpcoes = TIPO_LANCAMENTO_OPCOES;
  readonly moedas = MOEDAS;
  readonly limiteComprovante = LIMITE_COMPROVANTE_OBRIGATORIO;

  readonly categorias = signal<Categoria[]>([]);
  readonly contas = signal<ContaFinanceira[]>([]);
  readonly contrapartes = signal<Contraparte[]>([]);
  readonly carregandoCadastros = signal(true);
  readonly salvando = signal(false);

  /**
   * Chave de idempotência da submissão. Mantida em retentativas do mesmo
   * conteúdo e renovada sempre que o formulário é alterado.
   */
  private idempotencyKey = gerarUuid();

  readonly form = this.fb.group(
    {
      description: ['', [Validators.required, Validators.maxLength(255)]],
      entryType: [TipoLancamento.PAYABLE, Validators.required],
      originalAmount: [null as number | null, [Validators.required, valorPositivo()]],
      currency: [MOEDA_PADRAO, Validators.required],
      competenceDate: [this.primeiroDiaDoMes(), Validators.required],
      dueDate: [null as Date | null, Validators.required],
      categoryId: [null as string | null, Validators.required],
      accountId: [null as string | null, Validators.required],
      counterpartyId: [null as string | null, Validators.required],
    },
    { validators: vencimentoAposCompetencia },
  );

  private readonly tipo = toSignal(this.form.controls.entryType.valueChanges, {
    initialValue: this.form.controls.entryType.value,
  });
  private readonly valor = toSignal(this.form.controls.originalAmount.valueChanges, { initialValue: null });
  private readonly categoriaId = toSignal(this.form.controls.categoryId.valueChanges, { initialValue: null });

  readonly categoriasDoTipo = computed(() => this.categorias().filter((c) => categoriaAceitaTipo(c.categoryType, this.tipo())));

  readonly exigiraComprovante = computed(() => {
    const categoria = this.categorias().find((c) => c.id === this.categoriaId());
    return (this.valor() ?? 0) >= LIMITE_COMPROVANTE_OBRIGATORIO || !!categoria?.requiresAttachmentAlways;
  });

  ngOnInit(): void {
    forkJoin({
      categorias: this.categoriaService.listar().pipe(catchError(() => of([]))),
      contas: this.contaService.listar().pipe(catchError(() => of([]))),
      contrapartes: this.contraparteService.listar().pipe(catchError(() => of([]))),
    }).subscribe(({ categorias, contas, contrapartes }) => {
      this.categorias.set(categorias);
      this.contas.set(contas.filter((c) => c.active !== false));
      this.contrapartes.set(contrapartes.filter((c) => c.active !== false));
      this.carregandoCadastros.set(false);
    });

    // Ao trocar o tipo, limpa a categoria se ela não pertencer ao novo tipo.
    this.form.controls.entryType.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((tipo) => {
      const atual = this.categorias().find((c) => c.id === this.form.controls.categoryId.value);
      if (atual && !categoriaAceitaTipo(atual.categoryType, tipo)) this.form.controls.categoryId.setValue(null);
    });

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => (this.idempotencyKey = gerarUuid()));
  }

  rotuloContraparte(c: Contraparte): string {
    return c.tradeName ? `${c.tradeName} — ${c.legalName}` : c.legalName;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.salvando.set(true);
    this.lancamentoService
      .criar(
        {
          description: v.description!.trim(),
          entryType: v.entryType!,
          originalAmount: v.originalAmount!,
          currency: v.currency!,
          competenceDate: paraDataIso(v.competenceDate)!,
          dueDate: paraDataIso(v.dueDate)!,
          categoryId: v.categoryId!,
          accountId: v.accountId!,
          counterpartyId: v.counterpartyId!,
        },
        this.idempotencyKey,
      )
      .subscribe({
        next: (lancamento) => {
          this.messageService.add({ severity: 'success', summary: 'Lançamento criado', detail: lancamento.description });
          void this.router.navigate(['/lancamentos', lancamento.id]);
        },
        error: () => this.salvando.set(false),
      });
  }

  cancelar(): void {
    void this.router.navigate(['/lancamentos']);
  }

  private primeiroDiaDoMes(): Date {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  }
}
