import { Opcao } from '../../../interfaces/money.interface';

export enum AcaoAuditoria {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  SETTLE = 'SETTLE',
  PARTIAL_SETTLE_SPLIT = 'PARTIAL_SETTLE_SPLIT',
  CANCEL_SOFT_DELETE = 'CANCEL_SOFT_DELETE',
  AUTO_OVERDUE_TRANSITION = 'AUTO_OVERDUE_TRANSITION',
  UPLOAD_ATTACHMENT = 'UPLOAD_ATTACHMENT',
}

type Severidade = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

export const ACAO_AUDITORIA_META: Record<string, { label: string; icone: string; severidade: Severidade }> = {
  [AcaoAuditoria.CREATE]: { label: 'Criação', icone: 'pi pi-plus', severidade: 'info' },
  [AcaoAuditoria.UPDATE]: { label: 'Alteração', icone: 'pi pi-pencil', severidade: 'secondary' },
  [AcaoAuditoria.SETTLE]: { label: 'Liquidação', icone: 'pi pi-check', severidade: 'success' },
  [AcaoAuditoria.PARTIAL_SETTLE_SPLIT]: { label: 'Baixa parcial (split)', icone: 'pi pi-sitemap', severidade: 'success' },
  [AcaoAuditoria.CANCEL_SOFT_DELETE]: { label: 'Cancelamento', icone: 'pi pi-times', severidade: 'danger' },
  [AcaoAuditoria.AUTO_OVERDUE_TRANSITION]: { label: 'Vencimento automático', icone: 'pi pi-clock', severidade: 'warn' },
  [AcaoAuditoria.UPLOAD_ATTACHMENT]: { label: 'Anexo enviado', icone: 'pi pi-paperclip', severidade: 'contrast' },
};

export function metaAcao(acao: string): { label: string; icone: string; severidade: Severidade } {
  return ACAO_AUDITORIA_META[acao] ?? { label: acao, icone: 'pi pi-circle', severidade: 'secondary' };
}

export const ACAO_AUDITORIA_OPCOES: Opcao<AcaoAuditoria>[] = Object.values(AcaoAuditoria).map((value) => ({
  value,
  label: ACAO_AUDITORIA_META[value].label,
}));
