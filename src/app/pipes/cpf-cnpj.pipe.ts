import { Pipe, PipeTransform } from '@angular/core';

import { formatarCpfCnpj } from '../utils/cpf-cnpj.util';

@Pipe({ name: 'cpfCnpj', standalone: false })
export class CpfCnpjPipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    return valor ? formatarCpfCnpj(valor) : '—';
  }
}
