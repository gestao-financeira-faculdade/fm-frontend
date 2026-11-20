import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { cnpjValido, cpfValido, somenteDigitos } from './cpf-cnpj.util';

/** CPF (11 dígitos) ou CNPJ (14 dígitos) com dígitos verificadores válidos. */
export function cpfCnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value as string | null;
    if (!valor) return null;
    const d = somenteDigitos(valor);
    const ok = d.length === 11 ? cpfValido(d) : d.length === 14 ? cnpjValido(d) : false;
    return ok ? null : { cpfCnpj: true };
  };
}

/**
 * Valida no FormGroup que o campo `fim` não é anterior ao campo `inicio`.
 * O erro é registrado no grupo com a chave informada.
 */
export function intervaloDatasValidator(inicio: string, fim: string, chaveErro = 'intervaloDatas'): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(inicio)?.value as Date | null;
    const b = grupo.get(fim)?.value as Date | null;
    if (!a || !b) return null;
    return b.getTime() < a.getTime() ? { [chaveErro]: true } : null;
  };
}

/** Mínimo de caracteres contado depois do trim, como o backend faz. */
export function minimoAposTrimValidator(minimo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = ((control.value as string | null) ?? '').trim();
    if (!valor) return null;
    return valor.length < minimo ? { minimoAposTrim: { minimo, atual: valor.length } } : null;
  };
}

const SEMENTE_MAXIMA = 9223372036854775807n;

/** Semente da simulação como texto: o backend usa long de 64 bits, acima do que number representa sem perda. */
export function sementeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = ((control.value as string | null) ?? '').trim();
    if (!valor) return null;
    return /^\d{1,19}$/.test(valor) && BigInt(valor) <= SEMENTE_MAXIMA ? null : { semente: true };
  };
}
