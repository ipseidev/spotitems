import { Test, TestingModule } from '@nestjs/testing';
import { WowApiService } from './wow-api.service';

describe('WowApiService', () => {
  let service: WowApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WowApiService],
    }).compile();

    service = module.get<WowApiService>(WowApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
