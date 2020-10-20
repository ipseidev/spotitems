import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScannerModule } from './scanner/scanner.module';
import { ConfigModule } from '@nestjs/config';
import { WowApiModule } from './wow-api/wow-api.module';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';


@Module({
  imports: [
    ScannerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WowApiModule,
    HttpModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
