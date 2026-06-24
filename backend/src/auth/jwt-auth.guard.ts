import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Authentication token missing.');
    }
    try {
      // Debug: log the received token and secret used for verification
      // (temporary — remove after debugging)
      // eslint-disable-next-line no-console
      console.log('JwtAuthGuard: received token length', token?.length);
      // eslint-disable-next-line no-console
      console.log('JwtAuthGuard: using secret', process.env.JWT_SECRET ? '[REDACTED]' : '[none]');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'supersecretjwtkey123!@#',
      });
      request['user'] = payload;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('JwtAuthGuard: verify error', err?.message || err);
      throw new UnauthorizedException('Invalid or expired token.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
