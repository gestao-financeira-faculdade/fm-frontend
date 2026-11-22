import { AcaoAuditoria } from '../enums/acao-auditoria.enum';
import { TipoEntidade } from '../enums/tipo-entidade.enum';

export interface RegistroAuditoria {
  id: string;
  entityType: TipoEntidade | string;
  entityId: string;
  action: AcaoAuditoria | string;
  actorUserId?: string;
  actorName?: string;
  actorRole?: string;
  actorType?: string;
  occurredAt?: string;
  previousState?: unknown;
  newState?: unknown;
  ipAddress?: string;
  correlationId?: string;
}

export interface FiltroAuditoria {
  entityType?: string | null;
  entityId?: string | null;
  actorUserId?: string | null;
  action?: string | null;
  /** ISO 8601 Instant UTC */
  startDate?: string | null;
  endDate?: string | null;
}

export function dataRegistro(r: RegistroAuditoria): string | undefined {
  return r.occurredAt;
}

export function atorRegistro(r: RegistroAuditoria): string {
  return r.actorName ?? r.actorUserId ?? 'Sistema';
}
