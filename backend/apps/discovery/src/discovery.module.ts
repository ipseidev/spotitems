import { HttpModule, Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@core/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '@core/database/entities/item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HttpModule,
    TypeOrmModule.forFeature([Item]),
  ],
  controllers: [DiscoveryController],
  providers: [DiscoveryService],
})
export class DiscoveryModule {}
