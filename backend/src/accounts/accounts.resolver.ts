import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../common/dto/pagination.input';
import { Account } from './account.entity';
import { AccountsService } from './accounts.service';
import { CreateAccountInput } from './dto/create-account.input';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Mutation(() => Account)
  createAccount(@Args('input') input: CreateAccountInput): Promise<Account> {
    return this.accountsService.create(input);
  }

  @Query(() => [Account])
  accounts(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<Account[]> {
    return this.accountsService.list(pagination);
  }

  @Query(() => Account)
  account(@Args('id') id: string): Promise<Account> {
    return this.accountsService.getById(id);
  }
}
