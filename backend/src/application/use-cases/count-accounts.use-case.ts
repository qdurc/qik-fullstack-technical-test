import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';
import type { AccountRepository } from '../../domain/repositories/account.repository';

@Injectable()
export class CountAccountsUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: AccountRepository,
  ) {}

  execute(userId: string): Promise<number> {
    return this.accountsRepository.countByUserId(userId);
  }
}
