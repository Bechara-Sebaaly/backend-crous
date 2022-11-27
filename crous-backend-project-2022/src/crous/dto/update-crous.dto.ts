import { PartialType } from '@nestjs/mapped-types';
import { CreateCrousDto } from './create-crous.dto';

export class UpdateCrousDto extends PartialType(CreateCrousDto) {}
