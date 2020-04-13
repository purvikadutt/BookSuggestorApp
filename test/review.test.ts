import { Db } from 'mongodb';
import ReviewModel from '../src/models/ReviewModel';
import { initDb, getDb } from '../src/db';


describe('test review functions', () => {
  let db: Db;
  beforeAll(async (done) => {
    await initDb('booker');
    db = getDb();
    done();
  });

  it('should get a review successfully', async () => {
    const model = new ReviewModel();
    let id: string;
    await db.collection('reviews').findOne({}).then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      id = String(result._id);
    }).then(() => model.getReviewData(id))
      .then((status) => expect(status).toBe(200));
  });

  it('should fail validation bookId', async () => {
    const model = new ReviewModel();
    model.username = 'unit test';
    model.rating = 2;
    model.review = 'this is a unit test';
    const result = await model.ValidateReviewData();
    expect(result).toBe(false);
  });

  it('should fail validation username', async () => {
    const model = new ReviewModel();
    model.bookId = 'unit test';
    model.rating = 2;
    model.review = 'this is a unit test';
    const result = await model.ValidateReviewData();
    expect(result).toBe(false);
  });

  it('should fail validation rating', async () => {
    const model = new ReviewModel();
    model.bookId = 'unit test';
    model.username = 'unit test';
    model.review = 'this is a unit test';
    const result = await model.ValidateReviewData();
    expect(result).toBe(false);
  });

  it('should fail validation review', async () => {
    const model = new ReviewModel();
    model.bookId = 'this is a unit test';
    model.username = 'unit test';
    model.rating = 2;
    const result = await model.ValidateReviewData();
    expect(result).toBe(false);
  });

  it('should pass validation', async () => {
    const model = new ReviewModel();
    model.bookId = 'pass';
    model.username = 'unit test';
    model.rating = 2;
    model.review = 'this is a unit test';
    const result = await model.ValidateReviewData();
    expect(result).toBe(true);
  });

  it('should set review data successfully', async () => {
    const model = new ReviewModel();
    await db.collection('books').findOne({})
      .then((result) => model.setReviewData('', result.title, 'unit test', 'fake review', 0))
      .then((success) => {
        expect(success).toBe(true);
      });
  });

  it('should fail to set review data successfully', async () => {
    const model = new ReviewModel();
    await model.setReviewData('', 'xxdofesnt exfifstxx', 'unit test', 'fake review', 0)
      .then((success) => {
        expect(success).toBe(false);
      });
  });

  it('should add review successfully', async () => {
    const model = new ReviewModel();
    await db.collection('books').findOne({}).then((result) => model.setReviewData('', result.title, 'fakeUser', 'fake review', 0))
      .then(() => model.SaveNewReview())
      .then((status) => {
        expect(status).toBe(200);
      });
    await db.collection('reviews').deleteMany({ username: 'fakeUser' });
  });

  it('should report review successfully', async () => {
    const model = new ReviewModel();
    await db.collection('books').findOne({}).then((result) => model.setReviewData('', result.title, 'fakeUser', 'fake review', 0))
      .then(() => db.collection('reviews').insertOne(model))
      .then((result) => {
        model.id = String(result.insertedId);
        return model.ReportReview('fakeUser');
      })
      .then((status) => {
        expect(status).toBe(200);
      });
    await db.collection('reviews').deleteMany({ username: 'fakeUser' });
  });

  it('should give already reported review', async () => {
    const model = new ReviewModel();
    await db.collection('books').findOne({}).then((result) => model.setReviewData('', result.title, 'fakeUser', 'fake review', 0))
      .then(() => db.collection('reviews').insertOne(model))
      .then((result) => {
        model.id = String(result.insertedId);
        return model.ReportReview('fakeUser');
      })
      .then((status) => {
        expect(status).toBe(200);
        return model.ReportReview('fakeUser');
      })
      .then((status) => {
        expect(status).toBe(403);
      });
    await db.collection('reviews').deleteMany({ username: 'fakeUser' });
  });

  afterAll(async () => {
    await db.collection('reviews').deleteMany({ username: 'fakeUser' });
  });
});
