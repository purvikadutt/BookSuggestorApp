import { Db } from 'mongodb';
import CollectionModel from '../src/models/CollectionModel';
import CollectionsModel from '../src/models/CollectionsModel';
import { initDb, getDb } from '../src/db';


// assumes atleast 10 books in the database
describe('collections functions', () => {
  let db: Db;
  beforeAll(async (done) => {
    await initDb('booker');
    db = getDb();
    done();
  });

  it('should add a new collection', async () => {
    const model = new CollectionModel('', '', [], '');
    const bookIds: string[] = [];
    await db.collection('books').find({}).limit(3).forEach((result) => {
      // eslint-disable-next-line no-underscore-dangle
      bookIds.push(result._id);
    });
    const result = await model.NewCollection('test', 'fakeUser', bookIds);
    expect(result).not.toBe('');
  });

  it('Page 1 should contain books ', async () => {
    const model = new CollectionModel('', '', [], '');
    await db.collection('collections').findOne({}).then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      model.id = result._id;
      model.bookIds = result.bookIds;
      model.name = result.name;
      model.user = result.user;
    });
    await model.GetBooks(5, 1);
    expect(model.books.length).toBeLessThanOrEqual(5);
    expect(model.books.length).toBeGreaterThan(0);
  });

  it('Page 2 should contain books', async () => {
    const model = new CollectionModel('', '', [], '');
    await db.collection('collections').findOne({}).then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      model.id = result._id;
      model.bookIds = result.bookIds;
      model.name = result.name;
      model.user = result.user;
    });
    await model.GetBooks(3, 2);
    expect(model.books.length).toBeLessThanOrEqual(3);
    expect(model.books.length).toBeGreaterThan(0);
  });

  it('should find the collection', async () => {
    const model = new CollectionModel('', '', [], '');
    await db.collection('collections').findOne({}).then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      model.id = result._id;
      model.bookIds = result.bookIds;
      model.name = result.name;
      model.user = result.user;
    });
    const success = await model.FindCollection(model.user, model.name);
    expect(success).toBe(true);
  });

  it('should find the collection', async () => {
    const model = new CollectionModel('', '', [], '');
    await db.collection('collections').findOne({}).then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      model.id = result._id;
      model.bookIds = result.bookIds;
      model.name = result.name;
      model.user = result.user;
    });
    const success = await model.FindCollectionById(model.id);
    expect(success).toBe(true);
  });

  it('should find the collection', async () => {
    const model = new CollectionsModel();
    const success = await model.GetAllCollections();
    expect(success).toBe(true);
    expect(model.collections.length).toBeGreaterThan(0);
  });

  it('should find the collection', async () => {
    const model = new CollectionsModel();
    const result = await db.collection('collections').findOne({});
    const success = await model.GetCollections(result.user);
    expect(success).toBe(true);
    expect(model.collections.length).toBeGreaterThan(0);
  });
});
