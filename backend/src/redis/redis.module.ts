import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis, type RedisOptions } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('REDIS_HOST') ?? '127.0.0.1';
        const port = Number(config.get<string>('REDIS_PORT') ?? 6379);

        const options: RedisOptions = { host, port };
        const client = new Redis(options);
        client.on('error', () => {
          // Avoid crashing the app if Redis is down during dev.
        });

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
