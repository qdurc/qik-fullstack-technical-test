import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { LedgerEntry } from '../ledger/ledger-entry.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Account, LedgerEntry],
  synchronize: true,
});
