import { Component, computed, input } from '@angular/core';

import { STATUS_LANCAMENTO_META } from '../../enums/status-lancamento.enum';

@Component({
  selector: 'app-status-lancamento-tag',
  standalone: false,
  template: `<p-tag [value]="meta().label" [severity]="meta().severidade" [rounded]="true" />`,
})
export class StatusLancamentoTagComponent {
  readonly status = input.required<string>();

  readonly meta = computed(
    () => STATUS_LANCAMENTO_META[this.status()] ?? { label: this.status(), severidade: 'secondary' as const },
  );
}
