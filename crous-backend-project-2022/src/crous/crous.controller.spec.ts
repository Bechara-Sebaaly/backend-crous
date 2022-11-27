import { Test, TestingModule } from '@nestjs/testing';
import { CrousController } from './crous.controller';
import { CrousService } from './crous.service';

describe('CrousController', () => {
  let controller: CrousController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrousController],
      providers: [CrousService],
    }).compile();

    controller = module.get<CrousController>(CrousController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
