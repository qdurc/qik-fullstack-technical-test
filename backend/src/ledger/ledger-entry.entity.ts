import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { TransactionType } from '../common/enums/transaction-type.enum';

@ObjectType()
@Entity({ name: 'ledger_entries' })
export class LedgerEntry {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Index()
  @Column({ type: 'uuid' })
  accountId!: string;

  @Field(() => TransactionType)
  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @Field(() => String)
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => Account, (account) => account.ledgerEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account!: Account;
}
