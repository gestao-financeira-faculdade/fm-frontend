export enum FormatoRelatorio {
  CSV = 'CSV',
  PDF = 'PDF',
}

export const FORMATO_RELATORIO_OPCOES = [
  {
    value: FormatoRelatorio.CSV,
    label: 'CSV',
    icone: 'pi pi-file-excel',
    descricao: 'Planilha tabular, gerada por streaming. Ideal para análises no Excel ou BI.',
  },
  {
    value: FormatoRelatorio.PDF,
    label: 'PDF',
    icone: 'pi pi-file-pdf',
    descricao: 'Relatório executivo com layout corporativo, pronto para impressão.',
  },
];
