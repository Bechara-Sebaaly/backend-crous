import { Module } from '@nestjs/common';
import { CrousService } from './crous.service';
import { CrousController } from './crous.controller';

@Module({
  controllers: [CrousController],
  providers: [CrousService]
})
export class CrousModule {}
