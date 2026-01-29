import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Account } from '../../accounts/account.entity';
import { LedgerEntry } from '../../ledger/ledger-entry.entity';

@ObjectType()
export class AccountsPage {
  @Field(() => [Account])
  items!: Account[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;
}

@ObjectType()
export class TransactionsPage {
  @Field(() => [LedgerEntry])
  items!: LedgerEntry[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;
}
