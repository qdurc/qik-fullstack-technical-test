import { Resolver, Mutation } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { AuthPayload } from './dto/auth-payload.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly configService: ConfigService) {}

  @Mutation(() => AuthPayload)
  createDemoUser(): AuthPayload {
    const userId = randomUUID();
    const secret: Secret =
      this.configService.get<string>('JWT_SECRET') ?? 'dev_secret';
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') ?? '7d';
    const signOptions: SignOptions = {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };
    const token = jwt.sign({ sub: userId }, secret, signOptions);
    return { userId, token };
  }
}
