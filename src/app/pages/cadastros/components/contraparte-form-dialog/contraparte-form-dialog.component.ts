import { Component, effect, inject, model, output, signal, untracked } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { formatarCpfCnpj, somenteDigitos } from '../../../../utils/cpf-cnpj.util';
import { cpfCnpjValidator } from '../../../../utils/form-validators';
import { TIPO_CONTRAPARTE_OPCOES, TipoContraparte } from '../../enums/tipo-contraparte.enum';
import { Contraparte } from '../../interfaces/contraparte.interface';
import { ContraparteService } from '../../services/contraparte.service';

@Component({
  selector: 'app-contraparte-form-dialog',
  standalone: false,
  templateUrl: './contraparte-form-dialog.component.html',
})
export class ContraparteFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contraparteService = inject(ContraparteService);
  private readonly messageService = inject(MessageService);

  readonly visivel = model(false);
  readonly salvo = output<Contraparte>();

  readonly salvando = signal(false);
  readonly tipos = TIPO_CONTRAPARTE_OPCOES;

  readonly form = this.fb.nonNullable.group({
    legalName: ['', [Validators.required, Validators.maxLength(180)]],
    tradeName: ['', Validators.maxLength(180)],
    taxId: ['', cpfCnpjValidator()],
    counterpartyType: [TipoContraparte.SUPPLIER, Validators.required],
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

  formatarDocumento(): void {
    const ctrl = this.form.controls.taxId;
    ctrl.setValue(formatarCpfCnpj(ctrl.value), { emitEvent: false });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    const valor = this.form.getRawValue();
    this.contraparteService
      .criar({ ...valor, tradeName: valor.tradeName || undefined, taxId: somenteDigitos(valor.taxId) || undefined })
      .subscribe({
        next: (contraparte) => {
          this.messageService.add({ severity: 'success', summary: 'Contraparte cadastrada', detail: contraparte.legalName });
          this.salvo.emit(contraparte);
          this.visivel.set(false);
        },
        error: () => this.salvando.set(false),
      });
  }
}
