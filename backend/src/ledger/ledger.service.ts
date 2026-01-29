import { Injectable } from '@nestjs/common';
import { PaginationInput } from '../common/dto/pagination.input';
import { LedgerFiltersInput } from './dto/ledger-filters.input';
import { PostTransactionInput } from './dto/post-transaction.input';
import { LedgerEntry } from './ledger-entry.entity';
import { GetBalanceSummaryUseCase } from '../application/use-cases/get-balance-summary.use-case';
import { ListTransactionsUseCase } from '../application/use-cases/list-transactions.use-case';
import { PostCreditUseCase } from '../application/use-cases/post-credit.use-case';
import { PostDebitUseCase } from '../application/use-cases/post-debit.use-case';
import { TransactionType } from '../common/enums/transaction-type.enum';

@Injectable()
export class LedgerService {
  constructor(
    private readonly postCreditUseCase: PostCreditUseCase,
    private readonly postDebitUseCase: PostDebitUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
    private readonly getBalanceSummaryUseCase: GetBalanceSummaryUseCase,
  ) {}

  postTransaction(input: PostTransactionInput): Promise<LedgerEntry> {
    if (input.type === TransactionType.CREDIT) {
      return this.postCreditUseCase.execute(input);
    }

    return this.postDebitUseCase.execute(input);
  }

  list(filters?: LedgerFiltersInput, pagination?: PaginationInput): Promise<LedgerEntry[]> {
    return this.listTransactionsUseCase.execute(filters, pagination);
  }

  getBalanceSummary(accountId: string) {
    return this.getBalanceSummaryUseCase.execute(accountId);
  }
}
