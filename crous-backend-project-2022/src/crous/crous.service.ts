import { Injectable } from '@nestjs/common';
import { Crous } from './dto/api-crous.interface';

@Injectable()
export class CrousService {
  create(createCrousDto: Crous) {
    return 'This action adds a new crous';
  }

  findAll() {
    return `This action returns all crous`;
  }

  findOne(id: number) {
    return `This action returns a #${id} crous`;
  }

  update(id: number, updateCrousDto: Crous) {
    return `This action updates a #${id} crous`;
  }

  remove(id: number) {
    return `This action removes a #${id} crous`;
  }
}
