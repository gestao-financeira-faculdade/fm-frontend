import { Money, Percentual } from '../../../interfaces/money.interface';
import { FaixaDiariaProjecao } from '../../../shared/components/cone-incerteza-chart/cone-incerteza-chart.interface';

/** ExecutiveKpiResponse (formato documentado no contrato). */
export interface KpiExecutivo {
  consolidatedBalance: Money;
  totalReceivableToday: Money;
  totalPayableToday: Money;
  totalReceivableOverdue: Money;
  totalPayableOverdue: Money;
  monthlyDelinquencyRatePct: Percentual;
  referenceDate: string;
}

export interface ConeProjetado {
  simulationId: string;
  horizonDays: number;
  numScenarios: number;
  var99: Money;
  medianP50: Money;
  ruinProbabilityPct: Percentual;
  executionDevice: string;
  createdAt: string;
  dailyBands: FaixaDiariaProjecao[];
}

export interface ConeIncertezaResponse {
  historicalSeries: { date: string; balance: Money }[];
  projectionCone: ConeProjetado | null;
}

export interface FiltroCone {
  historyDays?: number | null;
  simulationId?: string | null;
  referenceDate?: string | null;
}
