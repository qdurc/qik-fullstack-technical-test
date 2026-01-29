import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Account } from '../../accounts/account.entity';
import { AccountRepository, ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';

@Injectable()
export class GetAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: AccountRepository,
  ) {}

  async execute(id: string): Promise<Account> {
    const account = await this.accountsRepository.findById(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }
}
