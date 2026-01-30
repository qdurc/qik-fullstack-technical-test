import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [ConfigModule],
  providers: [JwtAuthGuard, AuthResolver],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
