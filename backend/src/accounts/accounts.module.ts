import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CountAccountsUseCase } from '../application/use-cases/count-accounts.use-case';
import { CreateAccountUseCase } from '../application/use-cases/create-account.use-case';
import { GetAccountUseCase } from '../application/use-cases/get-account.use-case';
import { ListAccountsUseCase } from '../application/use-cases/list-accounts.use-case';
import { ACCOUNT_REPOSITORY } from '../domain/repositories/account.repository';
import { TypeOrmAccountRepository } from '../infrastructure/repositories/typeorm-account.repository';
import { Account } from './account.entity';
import { AccountsResolver } from './accounts.resolver';
import { AccountsService } from './accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), AuthModule],
  providers: [
    AccountsService,
    AccountsResolver,
    CreateAccountUseCase,
    ListAccountsUseCase,
    GetAccountUseCase,
    CountAccountsUseCase,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: TypeOrmAccountRepository,
    },
  ],
  exports: [AccountsService],
})
export class AccountsModule {}
