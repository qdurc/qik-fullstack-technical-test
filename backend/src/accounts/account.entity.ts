import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LedgerEntry } from '../ledger/ledger-entry.entity';

@ObjectType()
@Entity({ name: 'accounts' })
export class Account {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  userId!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 3, nullable: true })
  currency?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => LedgerEntry, (entry) => entry.account)
  ledgerEntries?: LedgerEntry[];
}
