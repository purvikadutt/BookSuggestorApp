import { Db } from 'mongodb';
import AdminDataModel from '../src/models/adminDataModel';
import { initDb, getDb } from '../src/db';


describe('get admin data', () => {
  let db: Db;
  beforeAll(async (done) => {
    await initDb('booker');
    db = getDb();
    done();
  });

  it('should get more than 0 users', async () => {
    const model = new AdminDataModel();
    const status = await model.GetAllUsers();
    expect(status).toBe(200);
    expect(model.users.length).toBeGreaterThan(0);
  });

  it('should get more than 0 reported reviews', async () => {
    const model = new AdminDataModel();
    const status = await model.GetReportedReviews();
    expect(status).toBe(200);
    expect(model.reportedReviews.length).toBeGreaterThan(0);
  });

  it('should successfully delete inserted review', async () => {
    const model = new AdminDataModel();
    const fakeReview = {
      id: '',
      bookId: '',
      bookTitle: '',
      username: 'fakeUser',
      review: '',
      rating: 0,
      reportedBy: ['fake', 'faker'],
    };
    let id: string;
    await db.collection('reviews').insertOne(fakeReview).then((result) => {
      id = String(result.insertedId);
    }).then(() => model.DeleteReview(id))
      .then((status) => expect(status).not.toBe(404));
    await db.collection('reviews').deleteMany({ username: 'fakeUser' });
  });

  it('should fail to delete and return 500', async () => {
    const model = new AdminDataModel();
    const status = await model.DeleteReview('this doesnt exist');
    expect(status).toBe(500);
  });
});
