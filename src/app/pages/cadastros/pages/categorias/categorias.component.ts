import { Component, inject, OnInit, signal } from '@angular/core';

import { TIPO_LANCAMENTO_LABEL } from '../../../../enums/tipo-lancamento.enum';
import { CADASTROS_PERMISSOES } from '../../cadastros-permissoes';
import { Categoria } from '../../interfaces/categoria.interface';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categorias',
  standalone: false,
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent implements OnInit {
  private readonly categoriaService = inject(CategoriaService);

  readonly permissoes = CADASTROS_PERMISSOES;
  readonly tipoLabel: Record<string, string> = TIPO_LANCAMENTO_LABEL;
  readonly categorias = signal<Categoria[]>([]);
  readonly carregando = signal(true);
  readonly dialogAberto = signal(false);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }
}
