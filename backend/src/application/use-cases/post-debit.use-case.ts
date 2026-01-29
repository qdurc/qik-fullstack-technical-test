import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LedgerEntry } from '../../ledger/ledger-entry.entity';
import { PostTransactionInput } from '../../ledger/dto/post-transaction.input';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { LEDGER_REPOSITORY } from '../../domain/repositories/ledger.repository';
import type { LedgerRepository } from '../../domain/repositories/ledger.repository';
import { AppError } from '../../common/errors/app-error';

@Injectable()
export class PostDebitUseCase {
  constructor(
    @Inject(LEDGER_REPOSITORY)
    private readonly ledgerRepository: LedgerRepository,
  ) {}

  async execute(input: PostTransactionInput): Promise<LedgerEntry> {
    if (input.type !== TransactionType.DEBIT) {
      throw new BadRequestException({
        message: 'Transaction type must be debit',
        code: 'INVALID_AMOUNT',
      });
    }

    const amount = Number(input.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      throw new BadRequestException({
        message: 'Invalid amount',
        code: 'INVALID_AMOUNT',
      });
    }

    try {
      return await this.ledgerRepository.postTransactionAtomic({
        accountId: input.accountId,
        type: TransactionType.DEBIT,
        amount: input.amount,
        description: input.description ?? null,
      });
    } catch (error) {
      if (error instanceof AppError) {
        if (error.code === 'ACCOUNT_NOT_FOUND') {
          throw new NotFoundException({
            message: error.message,
            code: error.code,
          });
        }
        if (error.code === 'INSUFFICIENT_FUNDS') {
          throw new BadRequestException({
            message: error.message,
            code: error.code,
          });
        }
      }
      throw error;
    }
  }
}
