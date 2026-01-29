import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';
import { AccountsModule } from '../src/accounts/accounts.module';
import { LedgerModule } from '../src/ledger/ledger.module';
import { Account } from '../src/accounts/account.entity';
import { LedgerEntry } from '../src/ledger/ledger-entry.entity';
import { AccountsService } from '../src/accounts/accounts.service';
import { LedgerService } from '../src/ledger/ledger.service';
import { TransactionType } from '../src/common/enums/transaction-type.enum';

const TEST_DB_NAME = process.env.TEST_DB_NAME || 'qik_accounts_test';

async function ensureTestDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'qik',
    password: process.env.DB_PASSWORD || 'qik',
    database: process.env.DB_ADMIN_DB || 'postgres',
  });

  await client.connect();
  const result = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [TEST_DB_NAME],
  );
  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE ${TEST_DB_NAME}`);
  }
  await client.end();
}

describe('Ledger integration (e2e)', () => {
  let app: INestApplication;
  let accountsService: AccountsService;
  let ledgerService: LedgerService;

  beforeAll(async () => {
    await ensureTestDatabase();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT || 5432),
          username: process.env.DB_USER || 'qik',
          password: process.env.DB_PASSWORD || 'qik',
          database: TEST_DB_NAME,
          entities: [Account, LedgerEntry],
          synchronize: true,
          dropSchema: true,
        }),
        AccountsModule,
        LedgerModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    accountsService = app.get(AccountsService);
    ledgerService = app.get(LedgerService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates account, credits, debits, lists with filters/pagination', async () => {
    const userId = 'c2a3f1c2-6e7d-4c2f-9a1c-111111111111';
    const account = await accountsService.create({ userId, currency: 'USD' });

    const credit1 = await ledgerService.postTransaction({
      accountId: account.id,
      type: TransactionType.CREDIT,
      amount: '100.00',
      description: 'initial',
    });

    await ledgerService.postTransaction({
      accountId: account.id,
      type: TransactionType.CREDIT,
      amount: '50.00',
      description: 'topup',
    });

    const debit = await ledgerService.postTransaction({
      accountId: account.id,
      type: TransactionType.DEBIT,
      amount: '25.00',
      description: 'purchase',
    });

    expect(credit1.id).toBeDefined();
    expect(debit.id).toBeDefined();

    const page1 = await ledgerService.list(
      { accountId: account.id, type: TransactionType.CREDIT },
      { page: 1, limit: 1 },
    );

    expect(page1.total).toBe(2);
    expect(page1.items).toHaveLength(1);

    const page2 = await ledgerService.list(
      { accountId: account.id, type: TransactionType.CREDIT },
      { page: 2, limit: 1 },
    );

    expect(page2.items).toHaveLength(1);

    const balance = await ledgerService.getBalanceSummary(account.id);
    expect(balance.balance).toBe('125.00');
  });
});
