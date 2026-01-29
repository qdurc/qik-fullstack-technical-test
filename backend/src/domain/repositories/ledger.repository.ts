import { LedgerEntry } from '../../ledger/ledger-entry.entity';
import { PaginationInput } from '../../common/dto/pagination.input';
import { LedgerFiltersInput } from '../../ledger/dto/ledger-filters.input';
import { TransactionType } from '../../common/enums/transaction-type.enum';

export interface LedgerRepository {
  create(
    entry: Pick<LedgerEntry, 'accountId' | 'type' | 'amount' | 'description'>,
  ): Promise<LedgerEntry>;
  postTransactionAtomic(
    entry: Pick<LedgerEntry, 'accountId' | 'type' | 'amount' | 'description'>,
  ): Promise<LedgerEntry>;
  findAll(
    filters?: LedgerFiltersInput,
    pagination?: PaginationInput,
  ): Promise<LedgerEntry[]>;
  count(filters?: LedgerFiltersInput): Promise<number>;
  getBalance(
    accountId: string,
  ): Promise<{ balance: string; credits: string; debits: string }>;
  getLatestByType(
    accountId: string,
    type: TransactionType,
  ): Promise<LedgerEntry | null>;
}

export const LEDGER_REPOSITORY = 'LEDGER_REPOSITORY';
