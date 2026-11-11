export interface Money {
  amount: number;
  currency: string;
}

export interface Percentual {
  value: number;
}

export interface Opcao<T> {
  label: string;
  value: T;
}
