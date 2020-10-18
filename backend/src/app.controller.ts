import { Controller, Get } from '@nestjs/common';
import { ScannerService } from './scanner/scanner.service';
import { WowApiService } from './wow-api/wow-api.service';

@Controller()
export class AppController {
  constructor(
    private readonly scanner: ScannerService,
    private readonly wowApi: WowApiService,
  ) {}

  @Get()
  getHello(): any {
    return this.scanner.scan();
  }

  @Get('/realms')
  async getRealms() {
    return await this.wowApi.getConnectedRealm();
  }
}
