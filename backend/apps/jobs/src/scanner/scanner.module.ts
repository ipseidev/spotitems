import { HttpModule, Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { WowApiModule } from '../wow-api/wow-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from '../../../../libs/database/src/entities/auction.entity';
import { User } from '../../../../libs/database/src/entities/user.entity';
import { Profile } from '../../../../libs/database/src/entities/profile.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule,
    WowApiModule,
    TypeOrmModule.forFeature([Auction, User, Profile]),
    ClientsModule.register([
      {
        name: 'DISCOVERY',
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
        },
      },
    ]),
  ],
  providers: [ScannerService],
  exports: [ScannerService],
})
export class ScannerModule {}
