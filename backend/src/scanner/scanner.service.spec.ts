import { Test, TestingModule } from '@nestjs/testing';
import { ScannerService } from './scanner.service';
import { RealmInterface } from '../realm/realm.interface';

describe('ScannerService', () => {
  let service: ScannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScannerService],
    }).compile();

    service = module.get<ScannerService>(ScannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a well formatted arrayUrl', () => {
    const fakeRealm: RealmInterface[] = [
      { realm: 'archimonde', zone: 'fr' },
      { realm: 'arathi', zone: 'fr' },
      { realm: 'Arak-arahm', zone: 'fr' },
    ];

    // @ts-ignore
    const urls = service.buildCallUrl(fakeRealm);
    expect(urls.length).toBe(3);
  });
});
