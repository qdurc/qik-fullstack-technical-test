import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LedgerEntry } from '../../ledger/ledger-entry.entity';
import { PostTransactionInput } from '../../ledger/dto/post-transaction.input';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { AccountRepository, ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';
import { LedgerRepository, LEDGER_REPOSITORY } from '../../domain/repositories/ledger.repository';

@Injectable()
export class PostCreditUseCase {
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

    if (input.type !== TransactionType.CREDIT) {
      throw new BadRequestException('Transaction type must be credit');
    }

    return this.ledgerRepository.create({
      accountId: input.accountId,
      type: TransactionType.CREDIT,
      amount: input.amount,
      description: input.description ?? null,
    });
  }
}
