import { Account } from '../../accounts/account.entity';
import { PaginationInput } from '../../common/dto/pagination.input';

export interface AccountRepository {
  create(account: Pick<Account, 'userId' | 'currency'>): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  findAll(pagination?: PaginationInput): Promise<Account[]>;
}

export const ACCOUNT_REPOSITORY = 'ACCOUNT_REPOSITORY';
