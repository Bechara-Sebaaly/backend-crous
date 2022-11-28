import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Crous } from './crous.interface';

export class ReducedCrousDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  shortDesc: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  closing: number;

  @IsString()
  @IsNotEmpty()
  photoURL: string;

  constructor(crous: Crous) {
    this.id = crous.id;
    this.type = crous.type;
    this.title = crous.title;
    this.shortDesc = crous.shortDesc;
    this.address = crous.address;
    this.phoneNumber = crous.phoneNumber;
    this.email = crous.email;
    this.closing = crous.closing;
    this.photoURL = crous.photoURL;
  }
}
