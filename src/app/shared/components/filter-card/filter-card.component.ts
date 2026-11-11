import { Component, input, output } from '@angular/core';

/**
 * Card de filtros. O formulário pertence à página: coloque [formGroup]
 * no próprio <app-filter-card> e os campos via ng-content.
 */
@Component({
  selector: 'app-filter-card',
  standalone: false,
  templateUrl: './filter-card.component.html',
})
export class FilterCardComponent {
  readonly titulo = input('Filtros');
  readonly carregando = input(false);

  readonly filtrar = output<void>();
  readonly limpar = output<void>();
}
