import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async onModuleInit() {
    await this.getCrousData();
  }

  create(createCrousDto: Crous) {
    if (
      !this.crousList.restaurants.find(
        (element) => element.id === createCrousDto.id,
      ) &&
      !this.crousList.restaurants.find((element) => element === createCrousDto)
    )
      this.crousList.restaurants.push(createCrousDto);
    else
      return new BadRequestException(
        'A RESTAURANT WITH THE SAME ID, OR SIMILAR DATA ALREADY EXISTS',
      );

    return this.findOneById(createCrousDto.id);
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
        this.crousList.restaurants.length,
      );

    let requestedData: ExpandedCrousDto[] = this.crousList.restaurants.slice(
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

  findOneById(id: string) {
    const crous = this.crousList.restaurants.find(
      (element) => element.id == id,
    );

    if (!crous) return new NotFoundException('CROUS NOT FOUND!');
    return crous;
  }

  searchByName(title: string) {
    const crous = this.crousList.restaurants.filter((element) =>
      element.title.includes(title),
    );

    if (!crous) return new NotFoundException('CROUS NOT FOUND!');
    if (crous.length == 1) return crous[0];
    return crous;
  }

  update(id: string, updatedCrous: Crous) {
    let index: number = this.getIndexOf(id);
    let newIdCheck: number = this.getIndexOf(updatedCrous.id);

    if (index !== -1 && newIdCheck === -1) {
      this.crousList.restaurants[index].id =
        updatedCrous?.id ?? this.crousList.restaurants[index].id;

      this.crousList.restaurants[index].address =
        updatedCrous?.address ?? this.crousList.restaurants[index].address;

      this.crousList.restaurants[index].closing =
        updatedCrous?.closing ?? this.crousList.restaurants[index].closing;

      this.crousList.restaurants[index].email =
        updatedCrous?.email ?? this.crousList.restaurants[index].email;

      this.crousList.restaurants[index].info =
        updatedCrous?.info ?? this.crousList.restaurants[index].info;

      this.crousList.restaurants[index].latitude =
        updatedCrous?.latitude ?? this.crousList.restaurants[index].latitude;

      this.crousList.restaurants[index].longitude =
        updatedCrous?.longitude ?? this.crousList.restaurants[index].longitude;

      this.crousList.restaurants[index].phoneNumber =
        updatedCrous?.phoneNumber ??
        this.crousList.restaurants[index].phoneNumber;

      this.crousList.restaurants[index].photoURL =
        updatedCrous?.photoURL ?? this.crousList.restaurants[index].photoURL;

      this.crousList.restaurants[index].shortDesc =
        updatedCrous?.shortDesc ?? this.crousList.restaurants[index].shortDesc;

      this.crousList.restaurants[index].title =
        updatedCrous?.title ?? this.crousList.restaurants[index].title;

      this.crousList.restaurants[index].type =
        updatedCrous?.type ?? this.crousList.restaurants[index].type;
    } else return new BadRequestException('ID ALREADY USED');

    return this.crousList.restaurants[index];
  }

  remove(id: string) {
    let index: number = this.getIndexOf(id);
    if (index !== -1) this.crousList.restaurants.splice(index, 1);
    else throw new NotFoundException('CROUS NOT FOUND!');

    return id;
  }

  private getIndexOf(id: string) {
    let i: number = -1;
    this.crousList.restaurants.forEach((element, index) => {
      if (element.id === id) i = index;
    });

    return i;
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

              apiData.restaurants.push({
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

    this.crousList.restaurants = this.sortCrousByTitle(apiData.restaurants);
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
