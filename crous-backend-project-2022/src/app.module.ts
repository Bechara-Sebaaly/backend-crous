import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrousModule } from './crous/crous.module';

@Module({
  imports: [CrousModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
