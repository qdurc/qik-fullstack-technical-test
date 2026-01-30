import { UnauthorizedException } from '@nestjs/common';

export const unauthorized = () =>
  new UnauthorizedException({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
