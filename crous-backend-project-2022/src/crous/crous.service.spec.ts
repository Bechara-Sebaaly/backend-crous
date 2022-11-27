import { Test, TestingModule } from '@nestjs/testing';
import { CrousService } from './crous.service';

describe('CrousService', () => {
  let service: CrousService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrousService],
    }).compile();

    service = module.get<CrousService>(CrousService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
