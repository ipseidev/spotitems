import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ScannerModule } from '../scanner/scanner.module';

@Module({
  imports: [ScannerModule],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {
}
