import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostDebitUseCase } from './post-debit.use-case';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { AppError } from '../../common/errors/app-error';
import type { LedgerRepository } from '../../domain/repositories/ledger.repository';

describe('PostDebitUseCase', () => {
  const makeRepo = () =>
    ({
      postTransactionAtomic: jest.fn(),
    }) as unknown as LedgerRepository;

  it('throws INVALID_AMOUNT when amount is invalid', async () => {
    const repo = makeRepo();
    const useCase = new PostDebitUseCase(repo);

    await expect(
      useCase.execute({
        accountId: '11111111-1111-1111-1111-111111111111',
        type: TransactionType.DEBIT,
        amount: '0',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws INSUFFICIENT_FUNDS when repo signals it', async () => {
    const repo = makeRepo();
    repo.postTransactionAtomic = jest
      .fn()
      .mockRejectedValue(
        new AppError('INSUFFICIENT_FUNDS', 'Insufficient funds'),
      );

    const useCase = new PostDebitUseCase(repo);

    await expect(
      useCase.execute({
        accountId: '11111111-1111-1111-1111-111111111111',
        type: TransactionType.DEBIT,
        amount: '10.00',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws ACCOUNT_NOT_FOUND when repo signals it', async () => {
    const repo = makeRepo();
    repo.postTransactionAtomic = jest
      .fn()
      .mockRejectedValue(
        new AppError('ACCOUNT_NOT_FOUND', 'Account not found'),
      );

    const useCase = new PostDebitUseCase(repo);

    await expect(
      useCase.execute({
        accountId: '11111111-1111-1111-1111-111111111111',
        type: TransactionType.DEBIT,
        amount: '10.00',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
