import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { intervaloDatasValidator } from '../../../utils/form-validators';

/** dueDate não pode ser anterior à competenceDate (regra do backend: 400). */
export const vencimentoAposCompetencia: ValidatorFn = intervaloDatasValidator(
  'competenceDate',
  'dueDate',
  'vencimentoAntesCompetencia',
);

/** Valor estritamente positivo. */
export function valorPositivo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value as number | null;
    if (v === null || v === undefined) return null;
    return v > 0 ? null : { valorPositivo: true };
  };
}
