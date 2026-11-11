import { Component, inject, OnInit, signal } from '@angular/core';

import { CADASTROS_PERMISSOES } from '../../cadastros-permissoes';
import { TIPO_CONTRAPARTE_LABEL } from '../../enums/tipo-contraparte.enum';
import { Contraparte } from '../../interfaces/contraparte.interface';
import { ContraparteService } from '../../services/contraparte.service';

@Component({
  selector: 'app-contrapartes',
  standalone: false,
  templateUrl: './contrapartes.component.html',
})
export class ContrapartesComponent implements OnInit {
  private readonly contraparteService = inject(ContraparteService);

  readonly permissoes = CADASTROS_PERMISSOES;
  readonly tipoLabel = TIPO_CONTRAPARTE_LABEL;
  readonly contrapartes = signal<Contraparte[]>([]);
  readonly carregando = signal(true);
  readonly dialogAberto = signal(false);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.contraparteService.listar().subscribe({
      next: (lista) => {
        this.contrapartes.set(lista);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }
}
