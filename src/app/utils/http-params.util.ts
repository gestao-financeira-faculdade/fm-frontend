import { HttpParams } from '@angular/common/http';

/** Monta HttpParams ignorando valores nulos, indefinidos ou strings vazias. */
export function montarParams(valores: object): HttpParams {
  let params = new HttpParams();
  for (const [chave, valor] of Object.entries(valores)) {
    if (valor === null || valor === undefined || valor === '') continue;
    params = params.set(chave, String(valor));
  }
  return params;
}
