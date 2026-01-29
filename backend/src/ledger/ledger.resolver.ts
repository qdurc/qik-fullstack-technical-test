import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PageInput } from '../common/dto/page.input';
import { TransactionsPage } from '../common/dto/page-response';
import { LedgerFiltersInput } from './dto/ledger-filters.input';
import { PostCreditInput } from './dto/post-credit.input';
import { PostDebitInput } from './dto/post-debit.input';
import { PostTransactionInput } from './dto/post-transaction.input';
import { LedgerEntry } from './ledger-entry.entity';
import { LedgerService } from './ledger.service';
import { BalanceSummary } from '../application/use-cases/get-balance-summary.use-case';
import { ObjectType, Field } from '@nestjs/graphql';
import { TransactionType } from '../common/enums/transaction-type.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ObjectType()
class BalanceSummaryType implements BalanceSummary {
  @Field(() => String)
  accountId!: string;

  @Field(() => String)
  credits!: string;

  @Field(() => String)
  debits!: string;

  @Field(() => String)
  balance!: string;
}

@Resolver(() => LedgerEntry)
export class LedgerResolver {
  constructor(private readonly ledgerService: LedgerService) {}

  @Mutation(() => LedgerEntry)
  @UseGuards(JwtAuthGuard)
  postCredit(@Args('input') input: PostCreditInput): Promise<LedgerEntry> {
    const payload: PostTransactionInput = {
      accountId: input.accountId,
      type: TransactionType.CREDIT,
      amount: input.amount,
      description: input.description,
    };
    return this.ledgerService.postTransaction(payload);
  }

  @Mutation(() => LedgerEntry)
  @UseGuards(JwtAuthGuard)
  postDebit(@Args('input') input: PostDebitInput): Promise<LedgerEntry> {
    const payload: PostTransactionInput = {
      accountId: input.accountId,
      type: TransactionType.DEBIT,
      amount: input.amount,
      description: input.description,
    };
    return this.ledgerService.postTransaction(payload);
  }

  @Query(() => TransactionsPage)
  @UseGuards(JwtAuthGuard)
  transactions(
    @Args('accountId') accountId: string,
    @Args('filters', { nullable: true }) filters?: LedgerFiltersInput,
    @Args('pagination', { nullable: true }) pagination?: PageInput,
  ): Promise<TransactionsPage> {
    const mergedFilters: LedgerFiltersInput = { ...filters, accountId };
    return this.ledgerService.list(
      mergedFilters,
      pagination,
    ) as Promise<TransactionsPage>;
  }

  @Query(() => BalanceSummaryType)
  @UseGuards(JwtAuthGuard)
  balanceSummary(
    @Args('accountId') accountId: string,
  ): Promise<BalanceSummary> {
    return this.ledgerService.getBalanceSummary(accountId);
  }
}
