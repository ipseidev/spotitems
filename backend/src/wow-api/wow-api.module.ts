import { HttpModule, Module } from '@nestjs/common';
import { WowApiService } from './wow-api.service';

@Module({
  imports: [HttpModule],
  providers: [WowApiService],
  exports: [WowApiService],
})
export class WowApiModule {}
