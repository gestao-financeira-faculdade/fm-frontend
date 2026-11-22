import { Component, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TableLazyLoadEvent } from 'primeng/table';

import { fimDoDiaUtc, inicioDoDiaUtc } from '../../../../utils/date.util';
import { ACAO_AUDITORIA_OPCOES, AcaoAuditoria, metaAcao } from '../../enums/acao-auditoria.enum';
import { TIPO_ENTIDADE_LABEL, TIPO_ENTIDADE_OPCOES, TipoEntidade } from '../../enums/tipo-entidade.enum';
import { atorRegistro, dataRegistro, FiltroAuditoria, RegistroAuditoria } from '../../interfaces/auditoria.interface';
import { AuditoriaService } from '../../services/auditoria.service';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Component({
  selector: 'app-trilha-auditoria',
  standalone: false,
  templateUrl: './trilha-auditoria.component.html',
})
export class TrilhaAuditoriaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auditoriaService = inject(AuditoriaService);

  readonly acoes = ACAO_AUDITORIA_OPCOES;
  readonly entidades = TIPO_ENTIDADE_OPCOES;
  readonly entidadeLabel = TIPO_ENTIDADE_LABEL;
  readonly meta = metaAcao;
  readonly data = dataRegistro;
  readonly ator = atorRegistro;

  readonly registros = signal<RegistroAuditoria[]>([]);
  readonly total = signal(0);
  readonly falha = signal<'sem-permissao' | 'erro' | null>(null);
  readonly carregando = signal(false);
  readonly primeiro = signal(0);
  readonly erroFiltro = signal<string | null>(null);

  readonly filtros = this.fb.group({
    entityType: [null as TipoEntidade | null],
    action: [null as AcaoAuditoria | null],
    entityId: [''],
    actorUserId: [''],
    periodo: this.fb.control<Date[] | null>(null),
  });

  private filtroAplicado: FiltroAuditoria = {};
  private tamanho = 20;

  aoCarregar(evento: TableLazyLoadEvent): void {
    const first = evento.first ?? 0;
    this.tamanho = evento.rows ?? 20;
    this.primeiro.set(first);
    this.buscar(Math.floor(first / this.tamanho));
  }

  filtrar(): void {
    const v = this.filtros.getRawValue();
    const ids = [v.entityId?.trim(), v.actorUserId?.trim()].filter(Boolean) as string[];
    if (ids.some((id) => !UUID.test(id))) {
      this.erroFiltro.set('IDs de entidade e de usuário devem ser UUIDs válidos.');
      return;
    }
    this.erroFiltro.set(null);
    const [inicio, fim] = v.periodo ?? [];
    this.filtroAplicado = {
      entityType: v.entityType,
      action: v.action,
      entityId: v.entityId?.trim() || null,
      actorUserId: v.actorUserId?.trim() || null,
      startDate: inicioDoDiaUtc(inicio),
      endDate: fimDoDiaUtc(fim ?? inicio),
    };
    this.primeiro.set(0);
    this.buscar(0);
  }

  limpar(): void {
    this.filtros.reset();
    this.filtrar();
  }

  filtrarPorEntidade(r: RegistroAuditoria): void {
    this.filtros.patchValue({ entityType: r.entityType as TipoEntidade, entityId: r.entityId });
    this.filtrar();
  }

  private buscar(pagina: number): void {
    this.carregando.set(true);
    this.falha.set(null);
    this.auditoriaService.listar(this.filtroAplicado, { page: pagina, size: this.tamanho }).subscribe({
      next: (resultado) => {
        this.registros.set(resultado.items);
        this.total.set(resultado.totalElements);
        this.carregando.set(false);
      },
      error: (e: { status?: number }) => {
        this.registros.set([]);
        this.total.set(0);
        this.falha.set(e.status === 403 ? 'sem-permissao' : 'erro');
        this.carregando.set(false);
      },
    });
  }
}
