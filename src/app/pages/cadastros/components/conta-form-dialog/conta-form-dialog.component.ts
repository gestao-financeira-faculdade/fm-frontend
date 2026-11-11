import { Component, effect, inject, model, output, signal, untracked } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { MOEDA_PADRAO, MOEDAS } from '../../../../constants/moedas';
import { TIPO_CONTA_OPCOES, TipoConta } from '../../enums/tipo-conta.enum';
import { ContaFinanceira } from '../../interfaces/conta.interface';
import { ContaService } from '../../services/conta.service';

@Component({
  selector: 'app-conta-form-dialog',
  standalone: false,
  templateUrl: './conta-form-dialog.component.html',
})
export class ContaFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contaService = inject(ContaService);
  private readonly messageService = inject(MessageService);

  readonly visivel = model(false);
  readonly salvo = output<ContaFinanceira>();

  readonly salvando = signal(false);
  readonly tiposConta = TIPO_CONTA_OPCOES;
  readonly moedas = MOEDAS;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    accountType: [TipoConta.OPERATIONAL_LEDGER, Validators.required],
    initialBalance: [0, Validators.required],
    currency: [MOEDA_PADRAO, Validators.required],
  });

  constructor() {
    // Reseta ao abrir (e não no onShow, que roda após a animação e apagaria o que já foi digitado).
    effect(() => {
      if (this.visivel()) untracked(() => this.aoAbrir());
    });
  }

  aoAbrir(): void {
    this.form.reset();
    this.salvando.set(false);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.contaService.criar(this.form.getRawValue()).subscribe({
      next: (conta) => {
        this.messageService.add({ severity: 'success', summary: 'Conta criada', detail: conta.name });
        this.salvo.emit(conta);
        this.visivel.set(false);
      },
      error: () => this.salvando.set(false),
    });
  }
}
