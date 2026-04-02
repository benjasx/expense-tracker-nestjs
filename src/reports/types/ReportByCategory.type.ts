export type TransactionType = 'ingreso' | 'gasto';

export interface CategoryAnalysis {
  categoria: string;
  tipo: TransactionType;
  total: number;
}
