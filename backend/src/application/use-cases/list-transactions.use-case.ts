import { Inject, Injectable } from '@nestjs/common';
import { PaginationInput } from '../../common/dto/pagination.input';
import { LedgerFiltersInput } from '../../ledger/dto/ledger-filters.input';
import { LedgerEntry } from '../../ledger/ledger-entry.entity';
import { LedgerRepository, LEDGER_REPOSITORY } from '../../domain/repositories/ledger.repository';

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject(LEDGER_REPOSITORY)
    private readonly ledgerRepository: LedgerRepository,
  ) {}

  execute(filters?: LedgerFiltersInput, pagination?: PaginationInput): Promise<LedgerEntry[]> {
    return this.ledgerRepository.findAll(filters, pagination);
  }
}
