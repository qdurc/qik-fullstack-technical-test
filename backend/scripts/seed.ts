import 'dotenv/config';
import { randomUUID } from 'crypto';
import { AppDataSource } from '../src/database/data-source';
import { Account } from '../src/accounts/account.entity';
import { LedgerEntry } from '../src/ledger/ledger-entry.entity';
import { TransactionType } from '../src/common/enums/transaction-type.enum';

const USER_ID = process.env.SEED_USER_ID || '11111111-1111-1111-1111-111111111111';

async function run() {
  await AppDataSource.initialize();
  const accountRepo = AppDataSource.getRepository(Account);
  const ledgerRepo = AppDataSource.getRepository(LedgerEntry);

  const account = accountRepo.create({
    userId: USER_ID,
    currency: 'USD',
  });
  await accountRepo.save(account);

  const entries: Array<Partial<LedgerEntry>> = [
    {
      id: randomUUID(),
      accountId: account.id,
      type: TransactionType.CREDIT,
      amount: '1000.00',
      description: 'Initial deposit',
    },
    {
      id: randomUUID(),
      accountId: account.id,
      type: TransactionType.DEBIT,
      amount: '125.50',
      description: 'Groceries',
    },
    {
      id: randomUUID(),
      accountId: account.id,
      type: TransactionType.CREDIT,
      amount: '250.00',
      description: 'Salary bonus',
    },
  ];

  for (const entry of entries) {
    const entity = ledgerRepo.create(entry);
    await ledgerRepo.save(entity);
  }

  // eslint-disable-next-line no-console
  console.log('Seed completed');
  // eslint-disable-next-line no-console
  console.log('UserId:', USER_ID);
  // eslint-disable-next-line no-console
  console.log('AccountId:', account.id);

  await AppDataSource.destroy();
}

run().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  await AppDataSource.destroy();
  process.exit(1);
});
