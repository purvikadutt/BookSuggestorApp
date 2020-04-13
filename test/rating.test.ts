import { Db } from 'mongodb';
import RatingModel from '../src/models/RatingModel';
import { initDb, getDb } from '../src/db';

describe('rating functions', () => {
  let db: Db;
  beforeAll(async (done) => {
    await initDb('booker');
    db = getDb();
    done();
  });

  it('get users rating for a book successfully', async () => {
    const result = await db.collection('ratings').findOne({});
    const model = new RatingModel('', '', 0);
    const success = await model.GetUsersRating(result.user, result.bookId);
    expect(success).toBe(true);
  });

  it('update users rating for a book successfully', async () => {
    const result = await db.collection('ratings').findOne({});
    const model = new RatingModel(result.user, result.bookId, result.rating);
    const success = await model.UpdateRating();
    expect(success).toBe(200);
  });
});
