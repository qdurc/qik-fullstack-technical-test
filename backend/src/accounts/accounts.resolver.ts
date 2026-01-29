import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { PageInput } from '../common/dto/page.input';
import { AccountsPage } from '../common/dto/page-response';
import { Account } from './account.entity';
import { AccountsService } from './accounts.service';
import { CreateAccountInput } from './dto/create-account.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Mutation(() => Account)
  @UseGuards(JwtAuthGuard)
  createAccount(@Args('input') input: CreateAccountInput): Promise<Account> {
    return this.accountsService.create(input);
  }

  @Query(() => AccountsPage)
  @UseGuards(JwtAuthGuard)
  accounts(
    @Context()
    ctx: { req?: { user?: { id?: string; sub?: string }; userId?: string } },
    @Args('pagination', { nullable: true }) pagination?: PageInput,
  ): Promise<AccountsPage> {
    const userId =
      ctx?.req?.user?.sub ?? ctx?.req?.user?.id ?? ctx?.req?.userId;
    if (!userId) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    return this.accountsService.listByUser(
      userId,
      pagination,
    ) as Promise<AccountsPage>;
  }

  @Query(() => Account)
  @UseGuards(JwtAuthGuard)
  account(@Args('id') id: string): Promise<Account> {
    return this.accountsService.getById(id);
  }
}
