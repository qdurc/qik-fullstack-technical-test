import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class CreateAccountInput {
  @Field(() => String)
  @IsUUID()
  userId!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;
}
