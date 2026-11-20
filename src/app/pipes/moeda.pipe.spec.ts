import { MoedaPipe } from './moeda.pipe';

describe('MoedaPipe', () => {
  const pipe = new MoedaPipe();

  it('formata Money em reais', () => {
    expect(pipe.transform({ amount: 1500.5, currency: 'BRL' })).toBe('R$ 1.500,50');
  });

  it('não lança erro com moeda fora da ISO-4217 vinda de dado legado', () => {
    expect(() => pipe.transform({ amount: 10, currency: 'XYZ' })).not.toThrow();
    expect(pipe.transform({ amount: 10, currency: '1$#' })).toBe('1$# 10,00');
  });
});
