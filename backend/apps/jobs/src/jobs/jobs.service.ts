import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ScannerService } from '../scanner/scanner.service';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class JobsService {
  constructor(private readonly scanerService: ScannerService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  public startScan() {
    this.scanerService.scan();
  }
}
