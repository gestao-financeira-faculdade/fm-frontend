import { Component, inject, OnInit, signal } from '@angular/core';

import { TIPO_CATEGORIA_LABEL, TIPO_CATEGORIA_SEVERIDADE } from '../../../../enums/tipo-categoria.enum';
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
  readonly tipoLabel: Record<string, string> = TIPO_CATEGORIA_LABEL;
  readonly tipoSeveridade: Record<string, 'danger' | 'success' | 'info'> = TIPO_CATEGORIA_SEVERIDADE;
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
