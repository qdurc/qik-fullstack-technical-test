import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../../accounts/account.entity';
import { ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';
import type { AccountRepository } from '../../domain/repositories/account.repository';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: AccountRepository,
  ) {}

  execute(input: { userId: string; currency?: string }): Promise<Account> {
    return this.accountsRepository.create({
      userId: input.userId,
      currency: input.currency ?? null,
    });
  }
}
