import { Component, input } from '@angular/core';

/** Cabeçalho padrão das páginas: título, subtítulo e ações (ng-content). */
@Component({
  selector: 'app-page-header',
  standalone: false,
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  readonly titulo = input.required<string>();
  readonly subtitulo = input<string>();
  readonly icone = input<string>();
}
