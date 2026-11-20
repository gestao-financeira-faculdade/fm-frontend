import { FaixaDiariaProjecao } from '../../../shared/components/cone-incerteza-chart/cone-incerteza-chart.interface';

/** Corpo (opcional) de POST /v1/simulations. */
export interface SimulacaoRequest {
  horizonDays: number;
  numScenarios: number;
  expectedDefaultRate: number;
  variableCostShockPct: number;
  randomSeed?: string | null;
}

/** SimulationResponse. randomSeed vem como string: valores acima de 2^53 perdem precisão em number. */
export interface Simulacao {
  id: string;
  horizonDays: number;
  numScenarios: number;
  var99: number;
  medianP50: number;
  ruinProbabilityPct: number;
  executionDevice: string;
  executionTimeMs: number;
  dailyBands: FaixaDiariaProjecao[];
  expectedDefaultRate?: number;
  variableCostShockPct?: number;
  randomSeed?: string | null;
  createdAt?: string;
}
