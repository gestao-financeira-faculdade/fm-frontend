/**
 * Ambiente padrão (desenvolvimento local).
 * Substituído em tempo de build por environment.{dev,qa,hm,prod}.ts — ver angular.json.
 */
export const environment = {
  production: false,
  nome: 'local',
  /** Base da API. Em dev o proxy (proxy.conf.json) encaminha /api para o backend. */
  apiUrl: '/api',
};
