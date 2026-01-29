import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../../accounts/account.entity';
import { CreateAccountInput } from '../../accounts/dto/create-account.input';
import { AccountRepository, ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: AccountRepository,
  ) {}

  execute(input: CreateAccountInput): Promise<Account> {
    return this.accountsRepository.create({
      userId: input.userId,
      currency: input.currency ?? null,
    });
  }
}
