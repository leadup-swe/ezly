import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { type Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), JwtStrategy.extractSessionCookie]),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  private static extractSessionCookie(req: Request): string | null {
    if (req.cookies && '__session' in req.cookies) return req.cookies.__session;
    return null;
  }

  async validate(payload: Record<string, string>) {
    return { userId: payload.sub, orgId: payload.org_id };
  }
}
