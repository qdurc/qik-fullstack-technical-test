export type Account = {
  id: string;
  userId: string;
  currency?: string | null;
  createdAt: string;
};

export type LedgerEntry = {
  id: string;
  accountId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: string;
  description?: string | null;
  createdAt: string;
};

export type BalanceSummary = {
  accountId: string;
  credits: string;
  debits: string;
  balance: string;
};

export type AccountsPage = {
  items: Account[];
  total: number;
  page: number;
  limit: number;
};

export type TransactionsPage = {
  items: LedgerEntry[];
  total: number;
  page: number;
  limit: number;
};
