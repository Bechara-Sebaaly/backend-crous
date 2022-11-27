import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrousService } from './crous.service';
import { CreateCrousDto } from './dto/create-crous.dto';
import { UpdateCrousDto } from './dto/update-crous.dto';

@Controller('crous')
export class CrousController {
  constructor(private readonly crousService: CrousService) {}

  @Post()
  create(@Body() createCrousDto: CreateCrousDto) {
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
  update(@Param('id') id: string, @Body() updateCrousDto: UpdateCrousDto) {
    return this.crousService.update(+id, updateCrousDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crousService.remove(+id);
  }
}
