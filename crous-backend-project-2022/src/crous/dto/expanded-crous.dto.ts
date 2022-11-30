import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Crous } from './crous.interface';

export class ExpandedCrousDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  zone: string;

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
  phoneNumber: string;

  @IsString()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  info: string;

  @IsNumber()
  @IsNotEmpty()
  closing: number;

  @IsString()
  @IsNotEmpty()
  photoURL: string;

  constructor(crous?: Crous) {
    this.id = crous?.id;
    this.type = crous?.type;
    this.zone = crous?.zone;
    this.title = crous?.title;
    this.shortDesc = crous?.shortDesc;
    this.address = crous?.address;
    this.phoneNumber = crous?.phoneNumber;
    this.email = crous?.email;
    this.latitude = crous?.latitude;
    this.longitude = crous?.longitude;
    this.info = crous?.info;
    this.closing = crous?.closing;
    this.photoURL = crous?.photoURL;
  }
}
