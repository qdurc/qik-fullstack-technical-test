import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Account } from '../../accounts/account.entity';
import { ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';
import type { AccountRepository } from '../../domain/repositories/account.repository';

@Injectable()
export class GetAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: AccountRepository,
  ) {}

  async execute(id: string): Promise<Account> {
    const account = await this.accountsRepository.findById(id);
    if (!account) {
      throw new NotFoundException({
        message: 'Account not found',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    return account;
  }
}
