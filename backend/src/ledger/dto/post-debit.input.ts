import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class PostDebitInput {
  @Field(() => String)
  @IsUUID()
  accountId!: string;

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
