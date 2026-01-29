import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PageInput } from '../common/dto/page.input';
import { LedgerFiltersInput } from './dto/ledger-filters.input';
import { PostTransactionInput } from './dto/post-transaction.input';
import { LedgerEntry } from './ledger-entry.entity';
import { GetBalanceSummaryUseCase } from '../application/use-cases/get-balance-summary.use-case';
import type { BalanceSummary } from '../application/use-cases/get-balance-summary.use-case';
import { ListTransactionsUseCase } from '../application/use-cases/list-transactions.use-case';
import { PostCreditUseCase } from '../application/use-cases/post-credit.use-case';
import { PostDebitUseCase } from '../application/use-cases/post-debit.use-case';
import { TransactionType } from '../common/enums/transaction-type.enum';

@Injectable()
export class LedgerService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly postCreditUseCase: PostCreditUseCase,
    private readonly postDebitUseCase: PostDebitUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
    private readonly getBalanceSummaryUseCase: GetBalanceSummaryUseCase,
  ) {}

  async postTransaction(input: PostTransactionInput): Promise<LedgerEntry> {
    const result =
      input.type === TransactionType.CREDIT
        ? await this.postCreditUseCase.execute(input)
        : await this.postDebitUseCase.execute(input);

    // Invalidate cached balance for the account
    const cacheKey = this.getBalanceCacheKey(input.accountId);
    try {
      await this.cacheManager.del(cacheKey);
    } catch {
      // Ignore cache errors to avoid breaking core flow.
    }

    return result;
  }

  async list(
    filters?: LedgerFiltersInput,
    page?: PageInput,
  ): Promise<{
    items: LedgerEntry[];
    total: number;
    page: number;
    limit: number;
  }> {
    const limit = page?.limit ?? 20;
    const currentPage = page?.page ?? 1;
    const offset = (currentPage - 1) * limit;

    const { items, total } = await this.listTransactionsUseCase.execute(
      filters,
      {
        limit,
        offset,
      },
    );
    return { items, total, page: currentPage, limit };
  }

  async getBalanceSummary(accountId: string): Promise<BalanceSummary> {
    const cacheKey = this.getBalanceCacheKey(accountId);
    try {
      const cached = await this.cacheManager.get<BalanceSummary>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch {
      // Ignore cache errors and fallback to DB.
    }

    const summary = await this.getBalanceSummaryUseCase.execute(accountId);
    try {
      await this.cacheManager.set(cacheKey, summary, 45);
    } catch {
      // Ignore cache errors.
    }

    return summary;
  }

  private getBalanceCacheKey(accountId: string): string {
    return `balance:${accountId}`;
  }
}
