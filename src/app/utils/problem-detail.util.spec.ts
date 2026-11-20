import { HttpErrorResponse } from '@angular/common/http';

import { extrairCodigoErro, mensagemErro } from './problem-detail.util';

const erro = (status: number, error: unknown) => new HttpErrorResponse({ status, error });

describe('problem-detail.util', () => {
  it('extrai o código de negócio de "code"', () => {
    expect(extrairCodigoErro(erro(422, { status: 422, code: 'MISSING_FISCAL_ATTACHMENT' }))).toBe('MISSING_FISCAL_ATTACHMENT');
  });

  it('extrai o código do final do "type"', () => {
    expect(extrairCodigoErro(erro(422, { type: 'https://api/errors/missing-fiscal-attachment' }))).toBe(
      'MISSING_FISCAL_ATTACHMENT',
    );
  });

  it('não confunde about:blank nem o reason phrase com código', () => {
    expect(extrairCodigoErro(erro(422, { type: 'about:blank', error: 'Unprocessable Entity' }))).toBeNull();
  });

  it('usa detail como mensagem e cai no texto padrão por status', () => {
    expect(mensagemErro(erro(422, { detail: 'Conta inativa' }))).toBe('Conta inativa');
    expect(mensagemErro(erro(409, null))).toContain('alterado por outro usuário');
  });

  it('mostra os erros por campo do 400 em vez do detail genérico', () => {
    const corpo = {
      status: 400,
      detail: 'One or more request parameters failed validation.',
      fieldErrors: { name: 'tamanho deve ser entre 0 e 100', 'request.taxId': 'CPF/CNPJ inválido' },
    };
    expect(mensagemErro(erro(400, corpo))).toBe('Nome: tamanho deve ser entre 0 e 100 • CPF/CNPJ: CPF/CNPJ inválido');
  });

  it('mantém o nome técnico quando o campo não tem rótulo conhecido', () => {
    expect(mensagemErro(erro(400, { fieldErrors: { horizonDays: 'must be 30, 60 or 90' } }))).toBe(
      'horizonDays: must be 30, 60 or 90',
    );
  });
});

