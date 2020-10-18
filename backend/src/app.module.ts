import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScannerModule } from './scanner/scanner.module';
import { ConfigModule } from '@nestjs/config';
import { WowApiModule } from './wow-api/wow-api.module';

@Module({
  imports: [ScannerModule, ConfigModule.forRoot({isGlobal: true}), WowApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
