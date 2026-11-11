import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: false,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly icone = input('pi pi-inbox');
  readonly titulo = input.required<string>();
  readonly mensagem = input<string>();
}
