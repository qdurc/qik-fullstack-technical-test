import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { TransactionType } from '../../common/enums/transaction-type.enum';

@InputType()
export class PostTransactionInput {
  @Field(() => String)
  @IsUUID()
  accountId!: string;

  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type!: TransactionType;

  @Field(() => String)
  @IsString()
  @Length(1, 50)
  amount!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;
}
