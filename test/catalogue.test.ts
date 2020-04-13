import request from 'supertest';
import app from '../src/app';
import CatalogueModel from '../src/models/CatalogueModel';
import CatalogueController from '../src/controllers/CatalogueController';
import { initDb } from '../src/db';


describe('HTTP Requests Post Login', () => {
  beforeAll(async (done) => {
    await initDb('booker');
    request(app).post('/login')
      .send({ userName: 'admin' })
      .expect(200);
    done();
  });
  /*
  it('should return 200', () => request(app)
    .get('/catalogue')
    .expect(200));

    it('should return 404', () => request(app)
    .get('/catalogue/0')
    .expect(404));
 */

  it('should return 404', () => request(app)
    .post('/catalogue/-1')
    .expect(404));
});
// assumes atleast 10 books in the database
describe('Pagination', () => {
  beforeAll(async (done) => {
    await initDb('booker');
    done();
  });

  it('Page 1 should contain books ', async () => {
    const model = new CatalogueModel();
    await model.GetBookData(5, 1);
    expect(model.books.length).toBeLessThanOrEqual(5);
    expect(model.books.length).toBeGreaterThan(0);
  });

  it('Page 2 should contain books', async () => {
    const model = new CatalogueModel();
    await model.GetBookData(3, 2);
    expect(model.books.length).toBeLessThanOrEqual(3);
    expect(model.books.length).toBeGreaterThan(0);
  });
});

describe('performance test', () => {
  beforeAll(async (done) => {
    await initDb('booker');
    done();
  });

  it('should take less than 750ms', (done) => {
    const controller = new CatalogueController();
    const next = jest.fn();
    let success = false;
    const req: any = {};
    const res: any = { locals: {} };
    setTimeout(() => { expect(success).toBe(true); }, 750);
    controller.GetBookData(
      req,
      res,
      next,
      true,
    ).then(() => {
      success = true;
      done();
    }).catch(() => {
      success = true;
      done();
    });
  });
});
