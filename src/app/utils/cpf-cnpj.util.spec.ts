import { cnpjValido, cpfValido, formatarCpfCnpj } from './cpf-cnpj.util';

describe('cpf-cnpj.util', () => {
  it('valida CPF', () => {
    expect(cpfValido('529.982.247-25')).toBeTrue();
    expect(cpfValido('529.982.247-24')).toBeFalse();
    expect(cpfValido('111.111.111-11')).toBeFalse();
  });

  it('valida CNPJ', () => {
    expect(cnpjValido('11.222.333/0001-81')).toBeTrue();
    expect(cnpjValido('11.222.333/0001-80')).toBeFalse();
    expect(cnpjValido('00.000.000/0000-00')).toBeFalse();
  });

  it('formata CPF e CNPJ', () => {
    expect(formatarCpfCnpj('52998224725')).toBe('529.982.247-25');
    expect(formatarCpfCnpj('11222333000181')).toBe('11.222.333/0001-81');
  });
});
