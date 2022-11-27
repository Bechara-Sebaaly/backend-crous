import { Injectable } from '@nestjs/common';
import { CreateCrousDto } from './dto/create-crous.dto';
import { UpdateCrousDto } from './dto/update-crous.dto';

@Injectable()
export class CrousService {
  create(createCrousDto: CreateCrousDto) {
    return 'This action adds a new crous';
  }

  findAll() {
    return `This action returns all crous`;
  }

  findOne(id: number) {
    return `This action returns a #${id} crous`;
  }

  update(id: number, updateCrousDto: UpdateCrousDto) {
    return `This action updates a #${id} crous`;
  }

  remove(id: number) {
    return `This action removes a #${id} crous`;
  }
}
