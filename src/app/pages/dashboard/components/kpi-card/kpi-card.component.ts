import { Component, input } from '@angular/core';

export type TomKpi = 'marca' | 'receita' | 'despesa' | 'alerta';

const CLASSES_TOM: Record<TomKpi, string> = {
  marca: 'bg-marca-50 text-marca-700',
  receita: 'bg-emerald-50 text-emerald-700',
  despesa: 'bg-red-50 text-red-700',
  alerta: 'bg-amber-50 text-amber-700',
};

@Component({
  selector: 'app-kpi-card',
  standalone: false,
  templateUrl: './kpi-card.component.html',
})
export class KpiCardComponent {
  readonly titulo = input.required<string>();
  readonly valor = input<string | null>(null);
  readonly icone = input.required<string>();
  readonly tom = input<TomKpi>('marca');
  readonly legenda = input<string>();
  readonly carregando = input(false);

  classesIcone(): string {
    return CLASSES_TOM[this.tom()];
  }
}
