import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';
import type { AccountRepository } from '../../domain/repositories/account.repository';
import { LEDGER_REPOSITORY } from '../../domain/repositories/ledger.repository';
import type { LedgerRepository } from '../../domain/repositories/ledger.repository';

export interface BalanceSummary {
  accountId: string;
  credits: string;
  debits: string;
  balance: string;
}

@Injectable()
export class GetBalanceSummaryUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: AccountRepository,
    @Inject(LEDGER_REPOSITORY)
    private readonly ledgerRepository: LedgerRepository,
  ) {}

  async execute(accountId: string): Promise<BalanceSummary> {
    const account = await this.accountsRepository.findById(accountId);
    if (!account) {
      throw new NotFoundException({
        message: 'Account not found',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    const summary = await this.ledgerRepository.getBalance(accountId);
    return {
      accountId,
      credits: summary.credits,
      debits: summary.debits,
      balance: summary.balance,
    };
  }
}
