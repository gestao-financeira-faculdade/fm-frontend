import { Money, Percentual } from '../../../interfaces/money.interface';

/** ExecutiveKpiResponse (formato documentado no contrato). */
export interface KpiExecutivo {
  consolidatedBalance: Money;
  totalReceivableToday: Money;
  totalPayableToday: Money;
  monthlyDelinquencyRatePct: Percentual;
  referenceDate: string;
}

/**
 * UncertaintyConeResponse. O contrato só nomeia historicalSeries e
 * projectionCone; os campos internos são inferidos e normalizados em
 * DashboardService.normalizarCone().
 */
export interface ConeIncertezaResponse {
  historicalSeries: Record<string, unknown>[];
  projectionCone: Record<string, unknown>[];
  simulationId?: string;
  referenceDate?: string;
}

export interface FiltroCone {
  historyDays?: number | null;
  simulationId?: string | null;
  referenceDate?: string | null;
}
