import { NestFactory } from '@nestjs/core';
import { DiscoveryModule } from './discovery.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DiscoveryModule,
    {
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379',
      },
    },
  );
  await app.listen(() => Logger.log('Microservice started', 'Discovery'));
}
bootstrap();
