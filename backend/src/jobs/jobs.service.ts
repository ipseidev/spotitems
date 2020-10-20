import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ScannerService } from '../scanner/scanner.service';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class JobsService {
  constructor(
    @Inject(forwardRef(() => ScannerService))
    private readonly scanerService: ScannerService,
  ) {
  }

  @Timeout(1000)
  public startScan() {
    this.scanerService.scan();
  }


}
