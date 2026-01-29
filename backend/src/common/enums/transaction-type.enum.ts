import { registerEnumType } from '@nestjs/graphql';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
});
