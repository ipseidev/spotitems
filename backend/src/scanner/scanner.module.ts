import { HttpModule, Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { WowApiModule } from '../wow-api/wow-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from '../database/entities/auction.entity';

@Module({
  imports: [HttpModule, WowApiModule, TypeOrmModule.forFeature([Auction])],
  providers: [ScannerService],
  exports: [ScannerService],
})
export class ScannerModule {}
