/** Corpo (opcional) de POST /v1/simulations. */
export interface SimulacaoRequest {
  horizonDays: number;
  numScenarios: number;
  expectedDefaultRate: number;
  variableCostShockPct: number;
  randomSeed?: number | null;
}

/** SimulationResponse. dailyBands não é detalhado no contrato (normalizado em cone.util). */
export interface Simulacao {
  id: string;
  horizonDays: number;
  numScenarios: number;
  var99: number;
  medianP50: number;
  ruinProbabilityPct: number;
  executionDevice: string;
  executionTimeMs: number;
  dailyBands: Record<string, unknown>[];
  expectedDefaultRate?: number;
  variableCostShockPct?: number;
  randomSeed?: number | null;
  createdAt?: string;
}
