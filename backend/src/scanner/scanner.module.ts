import { HttpModule, Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { WowApiModule } from '../wow-api/wow-api.module';

@Module({
  imports: [HttpModule, WowApiModule],
  providers: [ScannerService],
  exports: [ScannerService],
})
export class ScannerModule {}
