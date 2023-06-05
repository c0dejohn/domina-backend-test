import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptorService {
  constructor(private readonly configService: ConfigService) {}

  private get encryptKey(): string {
    return this.configService.get('SECRET_KEY');
  }

  encrypt(body: string): string {
    return CryptoJS.AES.encrypt(body, this.encryptKey).toString();
  }

  decrypt(body: any): string {
    return CryptoJS.AES.decrypt(body, this.encryptKey).toString(CryptoJS.enc.Utf8);
  }
}
