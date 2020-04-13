import { Db } from 'mongodb';
import BookModel from '../src/models/BookModel';
import { initDb, getDb } from '../src/db';

describe('Add book using BookModel', () => {
  let db: Db;
  beforeAll(async (done) => {
    await initDb('booker');
    db = getDb();
    done();
  });

  it('should be able to save book to database', async () => {
    const randisbn = Math.random() * (99999 - 10000) + 10000;

    const model = new BookModel();
    model.setBookData('Add book', 'No Image yet', 'By me', randisbn, 'Synopsis:This app is still a draft.', 0);
    const status = await model.SaveNewBook();
    expect(status).toBe(200);

    await db.collection('books').findOne({ isbn: randisbn }).then(async (t) => {
      expect(t.isbn).toBe(randisbn);
      // remove book added by test to keep database clean
      await db.collection('books').deleteOne({ isbn: randisbn });
    });
  });
});
