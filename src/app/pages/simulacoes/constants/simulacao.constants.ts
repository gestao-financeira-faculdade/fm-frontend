/** Horizontes aceitos pelo backend (422 fora disso). */
export const HORIZONTES_DIAS = [30, 60, 90] as const;

export const CENARIOS_MIN = 100_000;
export const CENARIOS_MAX = 1_000_000;

export const SIMULACAO_PADRAO = {
  horizonDays: 60,
  numScenarios: 200_000,
  expectedDefaultRate: 8.0,
  variableCostShockPct: 15.0,
  randomSeed: null as number | null,
};
