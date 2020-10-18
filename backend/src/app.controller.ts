import { Controller, Get } from '@nestjs/common';
import { ScannerService } from './scanner/scanner.service';
import { WowApiService } from './wow-api/wow-api.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly scanner: ScannerService,
    private readonly wowApi: WowApiService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): any {
    return this.scanner.scan();
  }

  @Get('test')
  getTest() {
    return this.appService.testHttp();
  }

  @Get('/realms')
  async getRealms() {
    return await this.wowApi.getConnectedRealm();
  }
}
