import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository, ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';
import { LedgerRepository, LEDGER_REPOSITORY } from '../../domain/repositories/ledger.repository';

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
      throw new NotFoundException('Account not found');
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
