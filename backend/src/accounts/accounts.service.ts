import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { CreateAccountUseCase } from '../application/use-cases/create-account.use-case';
import { GetAccountUseCase } from '../application/use-cases/get-account.use-case';
import { ListAccountsUseCase } from '../application/use-cases/list-accounts.use-case';

@Injectable()
export class AccountsService {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly listAccountsUseCase: ListAccountsUseCase,
    private readonly getAccountUseCase: GetAccountUseCase,
  ) {}

  create(input: CreateAccountInput): Promise<Account> {
    return this.createAccountUseCase.execute(input);
  }

  list(pagination?: PaginationInput): Promise<Account[]> {
    return this.listAccountsUseCase.execute(pagination);
  }

  getById(id: string): Promise<Account> {
    return this.getAccountUseCase.execute(id);
  }
}
