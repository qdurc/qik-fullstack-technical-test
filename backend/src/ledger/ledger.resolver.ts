import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../common/dto/pagination.input';
import { LedgerFiltersInput } from './dto/ledger-filters.input';
import { PostTransactionInput } from './dto/post-transaction.input';
import { LedgerEntry } from './ledger-entry.entity';
import { LedgerService } from './ledger.service';
import { BalanceSummary, GetBalanceSummaryUseCase } from '../application/use-cases/get-balance-summary.use-case';
import { ObjectType, Field } from '@nestjs/graphql';

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
  postTransaction(@Args('input') input: PostTransactionInput): Promise<LedgerEntry> {
    return this.ledgerService.postTransaction(input);
  }

  @Query(() => [LedgerEntry])
  ledgerEntries(
    @Args('filters', { nullable: true }) filters?: LedgerFiltersInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<LedgerEntry[]> {
    return this.ledgerService.list(filters, pagination);
  }

  @Query(() => BalanceSummaryType)
  balanceSummary(@Args('accountId') accountId: string): Promise<BalanceSummary> {
    return this.ledgerService.getBalanceSummary(accountId);
  }
}
