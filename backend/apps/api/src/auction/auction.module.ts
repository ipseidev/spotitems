import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from '@core/database/entities/auction.entity';
import { User } from '@core/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, User])],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule {}
