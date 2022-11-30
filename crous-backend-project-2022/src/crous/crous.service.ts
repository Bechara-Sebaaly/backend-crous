import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import e from 'express';
import { map, tap, lastValueFrom } from 'rxjs';
import {
  ApiCrous,
  Crous,
  CrousList,
  ExpandedCrousDto,
  ReducedCrousDto,
} from './dto';

@Injectable()
export class CrousService {
  private crousList: CrousList;

  constructor(private readonly httpService: HttpService) {}

  create(createCrousDto: Crous) {
    return 'This action adds a new crous';
  }

  findAll(page: number, rows: number, offset: number, sortBy: string) {
    let start: number,
      end: number,
      current: number,
      next: number,
      last: number,
      first: number;

    [start, end, current, next, last, first, rows] =
      this.getPaginationArguments(
        page,
        rows,
        offset,
        this.crousList.crousList.length,
      );

    let requestedData: ExpandedCrousDto[] = this.crousList.crousList.slice(
      start,
      end,
    );

    if (sortBy === 'title')
      requestedData = this.sortCrousByTitle(requestedData);
    else if (sortBy === 'address')
      requestedData = this.sortCrousByAddress(requestedData);
    else if (sortBy === 'type')
      requestedData = this.sortCrousByType(requestedData);

    let returnData: ReducedCrousDto[] = this.reduceData(requestedData);
    return { current, next, last, first, rows, returnData };
  }

  findOneById(id: string): ExpandedCrousDto {
    const crous = this.crousList.crousList.find((element) => element.id == id);

    if (!crous) throw new Error('CROUS NOT FOUND!');
    return crous;
  }

  searchByName(title: string) {
    const crous = this.crousList.crousList.filter((element) =>
      element.title.includes(title),
    );

    if (!crous) throw new Error('CROUS NOT FOUND!');
    if (crous.length == 1) return crous[0];
    return crous;
  }

  update(id: number, updateCrousDto: Crous) {
    return `This action updates a #${id} crous`;
  }

  remove(id: number) {
    return `This action removes a #${id} crous`;
  }

  async getCrousData() {
    let apiData = new CrousList();
    this.crousList = new CrousList();

    await lastValueFrom(
      this.httpService
        .get<ApiCrous>(
          'https://data.opendatasoft.com/api/records/1.0/search/?dataset=fr_crous_restauration_france_entiere%40mesr&q=&rows=-1',
        )
        .pipe(
          map((response) => response.data.records),
          tap((element) => {
            element.forEach((element) => {
              let [address, email, phoneNumber] = this.extractContacts(
                element.fields.contact,
              );

              apiData.crousList.push({
                id: element.fields.id,
                type: element.fields.type,
                zone: element.fields.zone ? element.fields.zone : '',
                title: element.fields.title,
                shortDesc: element.fields.short_desc
                  ? element.fields.short_desc
                  : '',
                address: address,
                phoneNumber: phoneNumber,
                email: email,
                latitude: element.fields.geolocalisation[0],
                longitude: element.fields.geolocalisation[0],
                info: element.fields.infos,
                closing: element.fields.closing,
                photoURL: element.fields.photo,
              });
            });
          }),
        ),
    );

    this.crousList.crousList = this.sortCrousByTitle(apiData.crousList);
    return this.crousList;
  }

  private extractContacts(contact: string): [string, string, string] {
    let address: string;
    let email: string;
    let phoneNumber: string;

    if (contact.includes(' Téléphone : ')) {
      address = contact.split(' Téléphone')[0];
      if (contact.includes('E-mail')) {
        phoneNumber = contact.split(' Téléphone : ')[1].split(' E-mail')[0];
        email = contact.split('E-mail : ')[1];
      } else {
        phoneNumber = contact.split(' Téléphone : ')[1];
        email = '';
      }
    } else if (contact.includes('E-mail')) {
      address = contact.split('E-mail')[0];
      phoneNumber = '';
      email = contact.split('E-mail : ')[1];
    } else {
      address = contact;
      phoneNumber = '';
      email = '';
    }
    return [address, email, phoneNumber];
  }

  private getPaginationArguments(
    page: number,
    rows: number,
    offset: number,
    length: number,
  ): [number, number, number, number, number, number, number] {
    page = page < 0 ? 0 : page;
    rows = rows <= 0 ? 10 : rows > length ? length : rows;
    offset = offset < 0 ? 0 : offset;

    let totalNbPages = Math.ceil(length / rows);
    let start = page * rows + offset > length ? 0 : page * rows + offset;
    let end = page * rows + offset + rows;
    let current = page;
    let next = page++ >= totalNbPages - 1 ? 0 : page++;
    let last = totalNbPages - 1;
    let first = 0;

    return [start, end, current, next, last, first, rows];
  }

  private sortCrousByTitle(crousList: ExpandedCrousDto[]): ExpandedCrousDto[] {
    return crousList.sort((fo: Crous, so: Crous) =>
      fo.title.localeCompare(so.title),
    );
  }

  private sortCrousByAddress(
    crousList: ExpandedCrousDto[],
  ): ExpandedCrousDto[] {
    return crousList.sort((fo: Crous, so: Crous) =>
      fo.address.localeCompare(so.address),
    );
  }

  private sortCrousByType(crousList: ExpandedCrousDto[]): ExpandedCrousDto[] {
    return crousList.sort((fo: Crous, so: Crous) =>
      fo.type.localeCompare(so.type),
    );
  }

  private reduceData(expandedData: ExpandedCrousDto[]): ReducedCrousDto[] {
    let reducedDataList: ReducedCrousDto[] = [];
    let reducedData: ReducedCrousDto;

    expandedData.forEach((element) => {
      reducedData = new ReducedCrousDto(element);
      reducedDataList.push(reducedData);
    });
    return reducedDataList;
  }
}
