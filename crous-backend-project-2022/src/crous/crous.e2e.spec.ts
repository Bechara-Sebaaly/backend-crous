import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest, * as request from 'supertest';
import { CrousModule } from './crous.module';

describe('Crous Controller (e2e)', () => {
  let app: INestApplication;
  let httpRequester: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CrousModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpRequester = request(app.getHttpServer());
  });

  it('/GET all crous restaurants sort by title', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ page: 0, rows: 10000, offset: 0, sortBy: 'title'})
      .expect(200);

    expect(response.body.returnData.length).toBeGreaterThanOrEqual(880);
    expect(response.body.returnData[0].title).toEqual('(S)pace Artem');
  });

  it('/GET all crous restaurants sort by zone', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ page: 0, rows: 10000, offset: 0 , sortBy: 'zone'})
      .expect(200);

    expect(response.body.returnData.length).toBeGreaterThanOrEqual(880);
    expect(response.body.returnData[0].zone).toEqual('');
  });

  it('/GET all crous restaurants sort by type', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ page: 0, rows: 10000, offset: 0, sortBy: 'type' })
      .expect(200);

    expect(response.body.returnData.length).toBeGreaterThanOrEqual(880);
    expect(response.body.returnData[0].type).toEqual('Brasserie');
  });

  it('/GET crous restaurants pagination', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ page: 0, rows: 10, offset: 0 })
      .expect(200);

    expect(response.body.returnData.length).toEqual(10);
    expect(response.body.current).toEqual(0);
    expect(response.body.next).toEqual(1);
    expect(response.body.last).toEqual(87);
    expect(response.body.first).toEqual(0);
  });

  it('/GET crous restaurants pagination with rows < 0', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ page: 0, rows: -1, offset: 0 })
      .expect(200);

    expect(response.body.returnData.length).toEqual(10);
    expect(response.body.current).toEqual(0);
    expect(response.body.next).toEqual(1);
    expect(response.body.last).toEqual(87);
    expect(response.body.first).toEqual(0);
  });

  it('/GET crous restaurants pagination with rows > length', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ page: 0, rows: 10000, offset: 0 })
      .expect(200);

    expect(response.body.returnData.length).toEqual(880);
    expect(response.body.current).toEqual(0);
    expect(response.body.next).toEqual(0);
    expect(response.body.last).toEqual(0);
    expect(response.body.first).toEqual(0);
  });

  it('/GET crous restaurants pagination with page = lastPage', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ page: 87, rows: 10, offset: 0 })
      .expect(200);

    expect(response.body.returnData.length).toEqual(10);
    expect(response.body.current).toEqual(87);
    expect(response.body.next).toEqual(0);
    expect(response.body.last).toEqual(87);
    expect(response.body.first).toEqual(0);
  });

  it('/GET crous restaurants by name', async () => {
    const response = await httpRequester
      .post('/crous/search/title')
      .send({ title: 'Cafet Evariste Galois' })
      .expect(201);

    expect(response.body.id).toEqual('r694');
  });

  it('/GET crous restaurants by part of a name', async () => {
    const response = await httpRequester
      .post('/crous/search/title')
      .send({ title: 'Cafet' })
      .expect(201);

    expect(response.body.length).toEqual(91);
  });

  it('/GET crous restaurants by id', async () => {
    const response = await httpRequester.get('/crous/r694').expect(200);

    expect(response.body.id).toEqual('r694');
  });
});