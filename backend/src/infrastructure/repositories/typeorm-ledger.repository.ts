import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../accounts/account.entity';
import { AppError } from '../../common/errors/app-error';
import { LedgerEntry } from '../../ledger/ledger-entry.entity';
import { PaginationInput } from '../../common/dto/pagination.input';
import { LedgerFiltersInput } from '../../ledger/dto/ledger-filters.input';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { LedgerRepository } from '../../domain/repositories/ledger.repository';

@Injectable()
export class TypeOrmLedgerRepository implements LedgerRepository {
  constructor(
    @InjectRepository(LedgerEntry)
    private readonly ledgerRepository: Repository<LedgerEntry>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    entry: Pick<LedgerEntry, 'accountId' | 'type' | 'amount' | 'description'>,
  ): Promise<LedgerEntry> {
    const entity = this.ledgerRepository.create({
      accountId: entry.accountId,
      type: entry.type,
      amount: entry.amount,
      description: entry.description ?? null,
    });

    return this.ledgerRepository.save(entity);
  }

  async postTransactionAtomic(
    entry: Pick<LedgerEntry, 'accountId' | 'type' | 'amount' | 'description'>,
  ): Promise<LedgerEntry> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const account = await queryRunner.manager.getRepository(Account).findOne({
        where: { id: entry.accountId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) {
        throw new AppError('ACCOUNT_NOT_FOUND', 'Account not found');
      }

      if (entry.type === TransactionType.DEBIT) {
        const totals = await queryRunner.manager
          .getRepository(LedgerEntry)
          .createQueryBuilder('entry')
          .select(
            `COALESCE(SUM(CASE WHEN entry.type = :credit THEN entry.amount ELSE 0 END), 0)`,
            'credits',
          )
          .addSelect(
            `COALESCE(SUM(CASE WHEN entry.type = :debit THEN entry.amount ELSE 0 END), 0)`,
            'debits',
          )
          .where('entry.accountId = :accountId', { accountId: entry.accountId })
          .setParameters({
            credit: TransactionType.CREDIT,
            debit: TransactionType.DEBIT,
          })
          .getRawOne<{ credits: string; debits: string }>();

        const credits = Number(totals?.credits ?? 0);
        const debits = Number(totals?.debits ?? 0);
        const balance = credits - debits;
        const amount = Number(entry.amount);

        if (balance < amount) {
          throw new AppError('INSUFFICIENT_FUNDS', 'Insufficient funds');
        }
      }

      const entity = queryRunner.manager.getRepository(LedgerEntry).create({
        accountId: entry.accountId,
        type: entry.type,
        amount: entry.amount,
        description: entry.description ?? null,
      });

      const saved = await queryRunner.manager
        .getRepository(LedgerEntry)
        .save(entity);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    filters?: LedgerFiltersInput,
    pagination?: PaginationInput,
  ): Promise<LedgerEntry[]> {
    const take = pagination?.limit ?? 20;
    const skip = pagination?.offset ?? 0;

    const query = this.ledgerRepository.createQueryBuilder('entry');

    if (filters?.accountId) {
      query.andWhere('entry.accountId = :accountId', {
        accountId: filters.accountId,
      });
    }

    if (filters?.type) {
      query.andWhere('entry.type = :type', { type: filters.type });
    }

    if (filters?.createdFrom) {
      query.andWhere('entry.createdAt >= :createdFrom', {
        createdFrom: filters.createdFrom,
      });
    }

    if (filters?.createdTo) {
      query.andWhere('entry.createdAt <= :createdTo', {
        createdTo: filters.createdTo,
      });
    }

    return query
      .orderBy('entry.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .getMany();
  }

  async count(filters?: LedgerFiltersInput): Promise<number> {
    const query = this.ledgerRepository.createQueryBuilder('entry');

    if (filters?.accountId) {
      query.andWhere('entry.accountId = :accountId', {
        accountId: filters.accountId,
      });
    }

    if (filters?.type) {
      query.andWhere('entry.type = :type', { type: filters.type });
    }

    if (filters?.createdFrom) {
      query.andWhere('entry.createdAt >= :createdFrom', {
        createdFrom: filters.createdFrom,
      });
    }

    if (filters?.createdTo) {
      query.andWhere('entry.createdAt <= :createdTo', {
        createdTo: filters.createdTo,
      });
    }

    return query.getCount();
  }

  async getBalance(
    accountId: string,
  ): Promise<{ balance: string; credits: string; debits: string }> {
    const result = await this.ledgerRepository
      .createQueryBuilder('entry')
      .select(
        `COALESCE(SUM(CASE WHEN entry.type = :credit THEN entry.amount ELSE 0 END), 0)`,
        'credits',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN entry.type = :debit THEN entry.amount ELSE 0 END), 0)`,
        'debits',
      )
      .where('entry.accountId = :accountId', { accountId })
      .setParameters({
        credit: TransactionType.CREDIT,
        debit: TransactionType.DEBIT,
      })
      .getRawOne<{ credits: string; debits: string }>();

    const credits = result?.credits ?? '0';
    const debits = result?.debits ?? '0';

    const balance = await this.ledgerRepository.manager.query(
      'SELECT ($1::numeric - $2::numeric)::text as balance',
      [credits, debits],
    );

    return {
      credits,
      debits,
      balance: balance?.[0]?.balance ?? '0',
    };
  }

  async getLatestByType(
    accountId: string,
    type: TransactionType,
  ): Promise<LedgerEntry | null> {
    return this.ledgerRepository.findOne({
      where: { accountId, type },
      order: { createdAt: 'DESC' },
    });
  }
}
