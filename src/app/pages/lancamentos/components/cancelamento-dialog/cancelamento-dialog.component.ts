import { Component, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { Lancamento } from '../../interfaces/lancamento.interface';
import { LancamentoService } from '../../services/lancamento.service';

@Component({
  selector: 'app-cancelamento-dialog',
  standalone: false,
  templateUrl: './cancelamento-dialog.component.html',
})
export class CancelamentoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly lancamentoService = inject(LancamentoService);
  private readonly messageService = inject(MessageService);

  readonly visivel = model(false);
  readonly lancamento = input.required<Lancamento>();
  readonly cancelado = output<void>();

  readonly salvando = signal(false);
  readonly form = this.fb.nonNullable.group({
    reason: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
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

  confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.lancamentoService.cancelar(this.lancamento().id, this.form.getRawValue().reason.trim()).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Lançamento cancelado' });
        this.cancelado.emit();
        this.visivel.set(false);
      },
      error: () => this.salvando.set(false),
    });
  }
}
