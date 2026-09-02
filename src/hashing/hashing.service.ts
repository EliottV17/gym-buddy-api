import { Injectable } from '@nestjs/common';

@Injectable()
export class HashingService {
  async hash(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: 'argon2id',
      memoryCost: 65536,
      timeCost: 2,
    });
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }
}
