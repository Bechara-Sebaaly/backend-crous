import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest, * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpRequester: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpRequester = request(app.getHttpServer());
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/GET all crous restaurants', async () => {
    const response = await httpRequester.get('/crous').expect(200);

    expect(response.body).toEqual(expect.any(Array));
    expect(response.body.length).toBeGreaterThanOrEqual(880);
  });

  it('/GET crous restaurants pagination', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ page: 0, rows: 10, offset: 0 })
      .expect(200);

    expect(response.body).toEqual(expect.any(Array));
    expect(response.body.length).toEqual(10);
    expect(response.body.current).toEqual(0);
    expect(response.body.next).toEqual(1);
    expect(response.body.last).toEqual(88);
    expect(response.body.first).toEqual(0);
  });

  it('/GET crous restaurants by name', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ crousName: 'Cafet Evariste Galois' })
      .expect(200);

    expect(response.body).toEqual(expect.any(Array));
    expect(response.body.length).toEqual(1);
    expect(response.body.id).toEqual('r694 ');
  });

  it('/GET crous restaurants by id', async () => {
    const response = await httpRequester.get('/crous/r694').expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body.id).toEqual('r694');
  });

  it('/GET crous restaurants sort by title', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ sortBy: 'title' })
      .expect(200);

    expect(response.body[0].title).toEqual('Arsonval SNACK');
  });

  it('/GET crous restaurants sort by zone', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ sortBy: 'zone' })
      .expect(200);

    expect(response.body[0].zone).toEqual('AISNE');
  });

  it('/GET crous restaurants sort by type', async () => {
    const response = await httpRequester
      .get('/crous')
      .query({ sortBy: 'type' })
      .expect(200);

    expect(response.body[0].type).toEqual('Brasserie');
  });
});
