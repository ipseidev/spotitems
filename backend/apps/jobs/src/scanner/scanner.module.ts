import { HttpModule, Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { WowApiModule } from '../wow-api/wow-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from '../../../../libs/database/src/entities/auction.entity';
import { User } from '../../../../libs/database/src/entities/user.entity';
import { Profile } from '../../../../libs/database/src/entities/profile.entity';

@Module({
  imports: [
    HttpModule,
    WowApiModule,
    TypeOrmModule.forFeature([Auction, User, Profile]),
  ],
  providers: [ScannerService],
  exports: [ScannerService],
})
export class ScannerModule {}
