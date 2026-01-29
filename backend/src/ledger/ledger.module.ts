import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetBalanceSummaryUseCase } from '../application/use-cases/get-balance-summary.use-case';
import { ListTransactionsUseCase } from '../application/use-cases/list-transactions.use-case';
import { PostCreditUseCase } from '../application/use-cases/post-credit.use-case';
import { PostDebitUseCase } from '../application/use-cases/post-debit.use-case';
import { ACCOUNT_REPOSITORY } from '../domain/repositories/account.repository';
import { LEDGER_REPOSITORY } from '../domain/repositories/ledger.repository';
import { TypeOrmAccountRepository } from '../infrastructure/repositories/typeorm-account.repository';
import { TypeOrmLedgerRepository } from '../infrastructure/repositories/typeorm-ledger.repository';
import { Account } from '../accounts/account.entity';
import { LedgerEntry } from './ledger-entry.entity';
import { LedgerResolver } from './ledger.resolver';
import { LedgerService } from './ledger.service';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerEntry, Account])],
  providers: [
    LedgerService,
    LedgerResolver,
    PostCreditUseCase,
    PostDebitUseCase,
    ListTransactionsUseCase,
    GetBalanceSummaryUseCase,
    {
      provide: LEDGER_REPOSITORY,
      useClass: TypeOrmLedgerRepository,
    },
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: TypeOrmAccountRepository,
    },
  ],
})
export class LedgerModule {}
