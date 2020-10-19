import { Global, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Auction } from './entities/auction.entity';
import { Repository } from 'typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      port: +configService.get<number>('DB_PORT'),
      synchronize: true,
      autoLoadEntities: true,
      logging: 'all',
      cache: true,
    }),
    inject: [ConfigService],
  })],
})
export class DatabaseModule {
}
