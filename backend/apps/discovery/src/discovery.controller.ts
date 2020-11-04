import { Controller, Logger } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';

@Controller()
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @MessagePattern('new_item')
  async discoverItem(@Payload() auction, @Ctx() context: RedisContext) {
    Logger.log('We have new auction');
    await this.discoveryService.discoverPipeline(parseInt(auction.item.id, 10));
  }
}
