import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrousService } from './crous.service';
import { Crous } from './dto/api-crous.interface';

@Controller('crous')
export class CrousController {
  constructor(private readonly crousService: CrousService) {}

  @Post()
  create(@Body() createCrousDto: Crous) {
    return this.crousService.create(createCrousDto);
  }

  @Get()
  findAll() {
    return this.crousService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crousService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCrousDto: Crous) {
    return this.crousService.update(+id, updateCrousDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crousService.remove(+id);
  }
}
