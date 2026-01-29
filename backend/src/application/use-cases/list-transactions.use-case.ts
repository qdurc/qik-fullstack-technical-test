import { Inject, Injectable } from '@nestjs/common';
import { PaginationInput } from '../../common/dto/pagination.input';
import { LedgerFiltersInput } from '../../ledger/dto/ledger-filters.input';
import { LedgerEntry } from '../../ledger/ledger-entry.entity';
import { LEDGER_REPOSITORY } from '../../domain/repositories/ledger.repository';
import type { LedgerRepository } from '../../domain/repositories/ledger.repository';

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject(LEDGER_REPOSITORY)
    private readonly ledgerRepository: LedgerRepository,
  ) {}

  execute(
    filters?: LedgerFiltersInput,
    pagination?: PaginationInput,
  ): Promise<{ items: LedgerEntry[]; total: number }> {
    const itemsPromise = this.ledgerRepository.findAll(filters, pagination);
    const totalPromise = this.ledgerRepository.count(filters);

    return Promise.all([itemsPromise, totalPromise]).then(([items, total]) => ({
      items,
      total,
    }));
  }
}
