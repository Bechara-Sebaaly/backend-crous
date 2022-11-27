import { IsNumber, IsString } from 'class-validator';
import { Crous } from './api-crous.interface';

export class CrousGetQuery {
  @IsNumber()
  page: number;

  @IsNumber()
  rows: number;

  @IsNumber()
  offset: number;

  @IsString()
  crousName: string;

  @IsString()
  sortBy: string;
}
