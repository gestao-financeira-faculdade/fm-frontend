import { STATUS_EM_ABERTO, STATUS_LANCAMENTO_META, STATUS_LANCAMENTO_OPCOES } from './status-lancamento.enum';

describe('status-lancamento.enum', () => {
  it('oferece exatamente os status que o backend devolve e aceita como filtro', () => {
    expect(STATUS_LANCAMENTO_OPCOES.map((o) => o.value)).toEqual(['PENDING', 'OVERDUE', 'PAID', 'RECEIVED', 'CANCELLED']);
  });

  it('tem rótulo em pt-BR para os status liquidados', () => {
    expect(STATUS_LANCAMENTO_META['PAID'].label).toBe('Pago');
    expect(STATUS_LANCAMENTO_META['RECEIVED'].label).toBe('Recebido');
  });

  it('considera em aberto só PENDING e OVERDUE', () => {
    expect(STATUS_EM_ABERTO).toEqual(['PENDING', 'OVERDUE']);
  });
});
