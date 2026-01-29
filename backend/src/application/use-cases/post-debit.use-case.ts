import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LedgerEntry } from '../../ledger/ledger-entry.entity';
import { PostTransactionInput } from '../../ledger/dto/post-transaction.input';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { AccountRepository, ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';
import { LedgerRepository, LEDGER_REPOSITORY } from '../../domain/repositories/ledger.repository';

@Injectable()
export class PostDebitUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: AccountRepository,
    @Inject(LEDGER_REPOSITORY)
    private readonly ledgerRepository: LedgerRepository,
  ) {}

  async execute(input: PostTransactionInput): Promise<LedgerEntry> {
    const account = await this.accountsRepository.findById(input.accountId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (input.type !== TransactionType.DEBIT) {
      throw new BadRequestException('Transaction type must be debit');
    }

    const balance = await this.ledgerRepository.getBalance(input.accountId);
    const current = Number(balance.balance);
    const amount = Number(input.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    if (current < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.ledgerRepository.create({
      accountId: input.accountId,
      type: TransactionType.DEBIT,
      amount: input.amount,
      description: input.description ?? null,
    });
  }
}
