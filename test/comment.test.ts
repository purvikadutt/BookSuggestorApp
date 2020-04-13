import { Db } from 'mongodb';
import CommentModel from '../src/models/CommentModel';
import BookModel from '../src/models/BookModel';
import { initDb, getDb } from '../src/db';

describe('comment functions', () => {
  let db: Db;
  beforeAll(async (done) => {
    await initDb('booker');
    db = getDb();
    done();
  });

  it('add a comment successfully', async () => {
    const model = new CommentModel('fake', 'fakeUser', 'this is a unit test');
    const status = await model.AddComment();
    expect(status).toBe(200);
    await db.collection('comments').deleteMany({ userId: 'fakeUser' });
  });

  it('get all comments for a book successfully', async () => {
    const book = new BookModel();
    const result = await db.collection('books').findOne({});
    // eslint-disable-next-line no-underscore-dangle
    book.id = result._id;
    const status = await book.GetBookDiscussion();
    expect(status).toBe(200);
  });
});
