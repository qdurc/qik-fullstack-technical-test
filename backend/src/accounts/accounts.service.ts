import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { PageInput } from '../common/dto/page.input';
import { CreateAccountUseCase } from '../application/use-cases/create-account.use-case';
import { GetAccountUseCase } from '../application/use-cases/get-account.use-case';
import { ListAccountsUseCase } from '../application/use-cases/list-accounts.use-case';
import { CountAccountsUseCase } from '../application/use-cases/count-accounts.use-case';

@Injectable()
export class AccountsService {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly listAccountsUseCase: ListAccountsUseCase,
    private readonly getAccountUseCase: GetAccountUseCase,
    private readonly countAccountsUseCase: CountAccountsUseCase,
  ) {}

  create(input: CreateAccountInput): Promise<Account> {
    return this.createAccountUseCase.execute(input);
  }

  async listByUser(
    userId: string,
    page?: PageInput,
  ): Promise<{ items: Account[]; total: number; page: number; limit: number }> {
    const limit = page?.limit ?? 20;
    const currentPage = page?.page ?? 1;
    const offset = (currentPage - 1) * limit;

    const [items, total] = await Promise.all([
      this.listAccountsUseCase.execute(userId, { limit, offset }),
      this.countAccountsUseCase.execute(userId),
    ]);

    return { items, total, page: currentPage, limit };
  }

  getById(id: string): Promise<Account> {
    return this.getAccountUseCase.execute(id);
  }
}
