import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../../accounts/account.entity';
import { PaginationInput } from '../../common/dto/pagination.input';
import { AccountRepository, ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository';

@Injectable()
export class ListAccountsUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: AccountRepository,
  ) {}

  execute(pagination?: PaginationInput): Promise<Account[]> {
    return this.accountsRepository.findAll(pagination);
  }
}
