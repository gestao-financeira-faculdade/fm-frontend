import type { TokenResponse, UsuarioResumo, LoginRequest, RefreshRequest } from '../interfaces/auth.interface';
import type { RegistroAuditoria } from '../pages/auditoria/interfaces/auditoria.interface';
import type { Categoria, CategoriaRequest } from '../pages/cadastros/interfaces/categoria.interface';
import type { ContaFinanceira, ContaFinanceiraRequest } from '../pages/cadastros/interfaces/conta.interface';
import type { Contraparte, ContraparteRequest } from '../pages/cadastros/interfaces/contraparte.interface';
import type { ConeIncertezaResponse, ConeProjetado, KpiExecutivo } from '../pages/dashboard/interfaces/dashboard.interface';
import type { Anexo } from '../pages/lancamentos/interfaces/anexo.interface';
import type { Lancamento, LancamentoRequest, LancamentoResumo, NoDesdobramento } from '../pages/lancamentos/interfaces/lancamento.interface';
import type { LiquidacaoRequest, LiquidacaoResponse } from '../pages/lancamentos/interfaces/liquidacao.interface';
import type { Simulacao, SimulacaoRequest } from '../pages/simulacoes/interfaces/simulacao.interface';
import type { FaixaDiariaProjecao } from '../shared/components/cone-incerteza-chart/cone-incerteza-chart.interface';
import type { components } from './schema';

type Esquema = components['schemas'];

/**
 * Falha a compilação quando o front declara um campo que o backend não envia nem aceita, o que inclui
 * os corpos de requisição: o backend recusa campos desconhecidos com 400.
 */
type SemCamposForaDoContrato<Front, Backend> = [Exclude<keyof Front, keyof Backend>] extends [never]
  ? true
  : { camposQueOBackendNaoTem: Exclude<keyof Front, keyof Backend> };

export const contratoDeRespostas: {
  token: SemCamposForaDoContrato<TokenResponse, Esquema['TokenResponse']>;
  usuario: SemCamposForaDoContrato<UsuarioResumo, Esquema['UserSummaryResponse']>;
  lancamento: SemCamposForaDoContrato<Lancamento, Esquema['FinancialEntryResponse']>;
  lancamentoResumo: SemCamposForaDoContrato<LancamentoResumo, Esquema['FinancialEntryResponse']>;
  desdobramento: SemCamposForaDoContrato<NoDesdobramento, Esquema['FinancialEntryLineageNode']>;
  liquidacao: SemCamposForaDoContrato<LiquidacaoResponse, Esquema['SettlementResponse']>;
  anexo: SemCamposForaDoContrato<Anexo, Esquema['FiscalAttachmentResponse']>;
  categoria: SemCamposForaDoContrato<Categoria, Esquema['CategoryResponse']>;
  conta: SemCamposForaDoContrato<ContaFinanceira, Esquema['FinancialAccountResponse']>;
  contraparte: SemCamposForaDoContrato<Contraparte, Esquema['CounterpartyResponse']>;
  simulacao: SemCamposForaDoContrato<Simulacao, Esquema['SimulationResponse']>;
  faixaSimulacao: SemCamposForaDoContrato<FaixaDiariaProjecao, Esquema['DailyBandResponse']>;
  kpis: SemCamposForaDoContrato<KpiExecutivo, Esquema['ExecutiveKpiResponse']>;
  cone: SemCamposForaDoContrato<ConeIncertezaResponse, Esquema['UncertaintyConeResponse']>;
  coneProjetado: SemCamposForaDoContrato<ConeProjetado, Esquema['ProjectedSimulationCone']>;
  auditoria: SemCamposForaDoContrato<RegistroAuditoria, Esquema['AuditLogItemResponse']>;
} = {
  token: true,
  usuario: true,
  lancamento: true,
  lancamentoResumo: true,
  desdobramento: true,
  liquidacao: true,
  anexo: true,
  categoria: true,
  conta: true,
  contraparte: true,
  simulacao: true,
  faixaSimulacao: true,
  kpis: true,
  cone: true,
  coneProjetado: true,
  auditoria: true,
};

export const contratoDeRequisicoes: {
  login: SemCamposForaDoContrato<LoginRequest, Esquema['LoginRequest']>;
  refresh: SemCamposForaDoContrato<RefreshRequest, Esquema['RefreshTokenRequest']>;
  lancamento: SemCamposForaDoContrato<LancamentoRequest, Esquema['CreateFinancialEntryRequest']>;
  liquidacao: SemCamposForaDoContrato<LiquidacaoRequest, Esquema['SettleFinancialEntryRequest']>;
  categoria: SemCamposForaDoContrato<CategoriaRequest, Esquema['CreateCategoryRequest']>;
  conta: SemCamposForaDoContrato<ContaFinanceiraRequest, Esquema['CreateFinancialAccountRequest']>;
  contraparte: SemCamposForaDoContrato<ContraparteRequest, Esquema['CreateCounterpartyRequest']>;
  simulacao: SemCamposForaDoContrato<SimulacaoRequest, Esquema['RunSimulationRequest']>;
} = {
  login: true,
  refresh: true,
  lancamento: true,
  liquidacao: true,
  categoria: true,
  conta: true,
  contraparte: true,
  simulacao: true,
};
