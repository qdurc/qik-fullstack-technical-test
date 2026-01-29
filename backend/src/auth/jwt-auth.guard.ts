import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import jwt, { type JwtPayload } from 'jsonwebtoken';

type JwtUserPayload = JwtPayload & {
  sub?: string;
  userId?: string;
  id?: string;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext<{
      req?: { headers?: Record<string, string | string[]>; user?: any };
    }>();
    const req =
      ctx?.req ??
      context.switchToHttp().getRequest<{
        headers?: Record<string, string | string[]>;
        user?: any;
      }>();

    const authHeader =
      req?.headers?.authorization ?? req?.headers?.Authorization;
    if (!authHeader || Array.isArray(authHeader)) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    try {
      const decoded = jwt.verify(token, secret);
      if (typeof decoded === 'string') {
        throw new UnauthorizedException({
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        });
      }
      const payload = decoded as JwtUserPayload;
      const userId = payload.sub ?? payload.userId ?? payload.id;
      if (!userId) {
        throw new UnauthorizedException({
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        });
      }

      if (req) {
        req.user = { id: userId, sub: userId, userId };
      }
      return true;
    } catch {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }
  }
}
