import { HttpModule, Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { WowApiModule } from '../wow-api/wow-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from '../database/entities/auction.entity';
import { User } from '../database/entities/user.entity';
import { Profile } from '../database/entities/profile.entity';

@Module({
  imports: [HttpModule, WowApiModule, TypeOrmModule.forFeature([Auction, User, Profile])],
  providers: [ScannerService],
  exports: [ScannerService],
})
export class ScannerModule {
}
