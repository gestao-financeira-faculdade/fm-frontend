import { TIPO_ENTIDADE_OPCOES } from '../../auditoria/enums/tipo-entidade.enum';
import { TIPO_CONTA_OPCOES } from './tipo-conta.enum';
import { TIPO_CONTRAPARTE_OPCOES } from './tipo-contraparte.enum';

describe('enums alinhados ao backend', () => {
  it('tipos de conta', () => {
    expect(TIPO_CONTA_OPCOES.map((o) => o.value)).toEqual(['OPERATIONAL_LEDGER', 'TREASURY_LEDGER', 'PETTY_CASH']);
    expect(TIPO_CONTA_OPCOES.every((o) => o.label !== o.value)).toBe(true);
  });

  it('tipos de contraparte', () => {
    expect(TIPO_CONTRAPARTE_OPCOES.map((o) => o.value).sort()).toEqual(
      ['CUSTOMER', 'EMPLOYEE', 'GOVERNMENT', 'OTHER', 'SUPPLIER'],
    );
    expect(TIPO_CONTRAPARTE_OPCOES.every((o) => o.label !== o.value)).toBe(true);
  });

  it('entidades auditadas', () => {
    expect(TIPO_ENTIDADE_OPCOES.map((o) => o.value)).toContain('COUNTERPARTY');
    expect(TIPO_ENTIDADE_OPCOES.every((o) => !!o.label)).toBe(true);
  });
});
