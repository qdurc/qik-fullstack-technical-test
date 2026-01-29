import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../accounts/account.entity';
import { PaginationInput } from '../../common/dto/pagination.input';
import { AccountRepository } from '../../domain/repositories/account.repository';

@Injectable()
export class TypeOrmAccountRepository implements AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async create(account: Pick<Account, 'userId' | 'currency'>): Promise<Account> {
    const entity = this.accountsRepository.create({
      userId: account.userId,
      currency: account.currency ?? null,
    });

    return this.accountsRepository.save(entity);
  }

  async findById(id: string): Promise<Account | null> {
    return this.accountsRepository.findOne({ where: { id } });
  }

  async findAll(pagination?: PaginationInput): Promise<Account[]> {
    const take = pagination?.limit ?? 20;
    const skip = pagination?.offset ?? 0;

    return this.accountsRepository.find({
      order: { createdAt: 'DESC' },
      take,
      skip,
    });
  }
}
