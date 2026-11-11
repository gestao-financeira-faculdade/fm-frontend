import { AcaoAuditoria } from '../enums/acao-auditoria.enum';
import { TipoEntidade } from '../enums/tipo-entidade.enum';

/**
 * AuditLogItemResponse. O contrato cita snapshots antes/depois
 * (previousState/newState), IP do cliente e correlationId; os demais
 * nomes de campo são inferidos — ajuste conforme o backend.
 */
export interface RegistroAuditoria {
  id: string;
  entityType: TipoEntidade | string;
  entityId: string;
  action: AcaoAuditoria | string;
  actorUserId?: string;
  actorName?: string;
  actorEmail?: string;
  occurredAt?: string;
  createdAt?: string;
  timestamp?: string;
  previousState?: unknown;
  newState?: unknown;
  clientIp?: string;
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
  return r.occurredAt ?? r.createdAt ?? r.timestamp;
}

export function atorRegistro(r: RegistroAuditoria): string {
  return r.actorName ?? r.actorEmail ?? r.actorUserId ?? 'Sistema';
}
