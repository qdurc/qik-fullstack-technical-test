import { Field, InputType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TransactionType } from '../../common/enums/transaction-type.enum';

@InputType()
export class LedgerFiltersInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @Field(() => TransactionType, { nullable: true })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  createdFrom?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  createdTo?: Date;
}
