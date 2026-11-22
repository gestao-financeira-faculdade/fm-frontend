import { FormControl } from '@angular/forms';

import { minimoAposTrimValidator, sementeValidator } from './form-validators';

describe('form-validators', () => {
  describe('sementeValidator', () => {
    const valida = (valor: string | null) => new FormControl(valor, sementeValidator()).valid;

    it('aceita sementes de 64 bits acima de 2^53 sem arredondar', () => {
      expect(valida('8361509756792018453')).toBe(true);
      expect(valida('9223372036854775807')).toBe(true);
      expect(valida('')).toBe(true);
      expect(valida(null)).toBe(true);
    });

    it('recusa valores fora do long ou não numéricos', () => {
      expect(valida('9223372036854775808')).toBe(false);
      expect(valida('0')).toBe(false);
      expect(valida('-1')).toBe(false);
      expect(valida('12a')).toBe(false);
      expect(valida('1.5')).toBe(false);
    });
  });

  describe('minimoAposTrimValidator', () => {
    const valida = (valor: string) => new FormControl(valor, minimoAposTrimValidator(5)).valid;

    it('conta os caracteres depois do trim, como o backend', () => {
      expect(valida('  ab  ')).toBe(false);
      expect(valida('   abcde   ')).toBe(true);
    });
  });
});
