import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';

import { fimDeHoje, paraDataIso } from '../../../../utils/date.util';
import { extrairCodigoErro, mensagemErro } from '../../../../utils/problem-detail.util';
import { ERRO_ANEXO_OBRIGATORIO, LIMITE_COMPROVANTE_OBRIGATORIO } from '../../constants/lancamento.constants';
import { Lancamento, saldoDevedor } from '../../interfaces/lancamento.interface';
import { LiquidacaoResponse } from '../../interfaces/liquidacao.interface';
import { LancamentoService } from '../../services/lancamento.service';

type ErroLiquidacao = { tipo: 'conflito' | 'anexo' | 'outro'; mensagem: string };

@Component({
  selector: 'app-liquidacao-dialog',
  standalone: false,
  templateUrl: './liquidacao-dialog.component.html',
})
export class LiquidacaoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly lancamentoService = inject(LancamentoService);

  readonly visivel = model(false);
  readonly lancamento = input.required<Lancamento>();
  /** true se a categoria exige comprovante sempre. */
  readonly categoriaExigeAnexo = input(false);
  readonly quantidadeAnexos = input(0);

  readonly liquidado = output<LiquidacaoResponse>();
  /** 409: o pai deve recarregar o lançamento (nova versão). */
  readonly recarregar = output<void>();
  /** 422 MISSING_FISCAL_ATTACHMENT: o pai leva o usuário à aba de anexos. */
  readonly irParaAnexos = output<void>();

  readonly salvando = signal(false);
  readonly erro = signal<ErroLiquidacao | null>(null);
  readonly hoje = fimDeHoje();

  readonly form = this.fb.nonNullable.group({
    paidAmount: [0, [Validators.required, Validators.min(0.01)]],
    discountAmount: [0, [Validators.required, Validators.min(0)]],
    interestAmount: [0, [Validators.required, Validators.min(0)]],
    lateFeeAmount: [0, [Validators.required, Validators.min(0)]],
    settlementDate: [new Date(), Validators.required],
    allowPartial: [false],
  });

  private readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  readonly saldo = computed(() => saldoDevedor(this.lancamento()));

  readonly exigeAnexo = computed(
    () => this.categoriaExigeAnexo() || this.lancamento().originalAmount >= LIMITE_COMPROVANTE_OBRIGATORIO,
  );
  readonly semAnexoObrigatorio = computed(() => this.exigeAnexo() && this.quantidadeAnexos() === 0);

  readonly parcial = computed(() => (this.valores().paidAmount ?? 0) < this.saldo());

  constructor() {
    // Reseta ao abrir (e não no onShow, que roda após a animação e apagaria o que já foi digitado).
    effect(() => {
      if (this.visivel()) untracked(() => this.aoAbrir());
    });
  }

  aoAbrir(): void {
    this.erro.set(null);
    this.salvando.set(false);
    this.form.reset({
      paidAmount: this.saldo(),
      discountAmount: 0,
      interestAmount: 0,
      lateFeeAmount: 0,
      settlementDate: new Date(),
      allowPartial: false,
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    if (this.parcial() && !v.allowPartial) {
      this.erro.set({
        tipo: 'outro',
        mensagem: 'O valor pago é menor que o saldo devedor. Marque "Permitir baixa parcial" para continuar.',
      });
      return;
    }

    this.salvando.set(true);
    this.erro.set(null);
    this.lancamentoService
      .liquidar(this.lancamento().id, {
        ...v,
        settlementDate: paraDataIso(v.settlementDate)!,
        expectedVersion: this.lancamento().version ?? 0,
      })
      .subscribe({
        next: (resposta) => {
          this.salvando.set(false);
          this.liquidado.emit(resposta);
          this.visivel.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.salvando.set(false);
          this.erro.set(this.classificarErro(e));
        },
      });
  }

  aoRecarregar(): void {
    this.visivel.set(false);
    this.recarregar.emit();
  }

  aoIrParaAnexos(): void {
    this.visivel.set(false);
    this.irParaAnexos.emit();
  }

  private classificarErro(e: HttpErrorResponse): ErroLiquidacao {
    if (e.status === 409) {
      return {
        tipo: 'conflito',
        mensagem: 'Este lançamento foi alterado por outra pessoa. Recarregue para ver a versão atual e tente novamente.',
      };
    }
    if (e.status === 422 && extrairCodigoErro(e) === ERRO_ANEXO_OBRIGATORIO) {
      return {
        tipo: 'anexo',
        mensagem: 'A liquidação exige um comprovante fiscal anexado (valor ≥ R$ 5.000,00 ou categoria com comprovante obrigatório).',
      };
    }
    return { tipo: 'outro', mensagem: mensagemErro(e) };
  }
}
