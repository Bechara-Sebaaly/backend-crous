import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CrousService } from './crous.service';
import { Crous, ExpandedCrousDto } from './dto';

@Controller('crous')
export class CrousController {
  constructor(private readonly crousService: CrousService) {}

  async onModuleInit() {
    await this.crousService.getCrousData();
  }

  @Post()
  create(@Body() createCrousDto: ExpandedCrousDto) {
    return this.crousService.create(createCrousDto);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('rows', ParseIntPipe) rows: number,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('sortBy') sortBy: string,
  ) {
    return this.crousService.findAll(page, rows, offset, sortBy);
  }

  @Get('/:id')
  findOneById(@Param('id') id: string) {
    return this.crousService.findOneById(id);
  }

  @Post('/search/title')
  searchByName(@Body('title') title: string) {
    console.log(title);
    return this.crousService.searchByName(title);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateCrousDto: Crous) {
    return this.crousService.update(id, updateCrousDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.crousService.remove(id);
  }
}
