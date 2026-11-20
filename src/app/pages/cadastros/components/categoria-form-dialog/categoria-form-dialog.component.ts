import { Component, effect, inject, model, output, signal, untracked } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { TIPO_CATEGORIA_OPCOES, TipoCategoria } from '../../../../enums/tipo-categoria.enum';
import { Categoria } from '../../interfaces/categoria.interface';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-form-dialog',
  standalone: false,
  templateUrl: './categoria-form-dialog.component.html',
})
export class CategoriaFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoriaService = inject(CategoriaService);
  private readonly messageService = inject(MessageService);

  readonly visivel = model(false);
  readonly salvo = output<Categoria>();

  readonly salvando = signal(false);
  readonly tipos = TIPO_CATEGORIA_OPCOES;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    categoryType: [TipoCategoria.PAYABLE, Validators.required],
    requiresAttachmentAlways: [false],
    fixedCost: [false],
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
    this.categoriaService.criar(this.form.getRawValue()).subscribe({
      next: (categoria) => {
        this.messageService.add({ severity: 'success', summary: 'Categoria criada', detail: categoria.name });
        this.salvo.emit(categoria);
        this.visivel.set(false);
      },
      error: () => this.salvando.set(false),
    });
  }
}
