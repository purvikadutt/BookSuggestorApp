import { getDb } from '../db';
import BookModel from './BookModel';

const ObjectId = require('mongodb').ObjectID;

/**
 * @class CollectionModel
 */
export default class CollectionModel {
  public id: string;

  public bookIds: string[];

  public user: string;

  public name: string;

  public pageNumber: number;

  public totalPages: number;

  public booksPerPage: number;

  public totalBooks: number;

  public books: BookModel[];

  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */
  constructor(
    id: string,
    user: string,
    bookIds: string[],
    name: string,
  ) {
    // initialize variables
    this.id = id;
    this.user = user;
    this.bookIds = [];
    this.name = name;
    this.books = [];
    this.pageNumber = 1;
    this.totalPages = -1;
    this.booksPerPage = -1;
    this.totalBooks = -1;
  }

  // Retrieve all books in a collection
  public async GetBooks(perPage: number, pageNum: number): Promise<number> {
    const db = getDb();
    if (this.bookIds.length < 1) {
      return 201;
    }
    // If we don't know a page count, or if the booksPerPage has been changed, re-calc page numbers.
    if (this.totalPages === -1 || this.booksPerPage !== perPage) {
      this.booksPerPage = perPage;
      this.totalBooks = this.bookIds.length;
      this.totalPages = Math.ceil(this.totalBooks / this.booksPerPage);
    }

    // 404 for invalid pages
    if (pageNum > this.totalPages || pageNum < 1) {
      return 404;
    }

    this.pageNumber = pageNum;

    const ids = [ObjectId()];
    ids.pop();
    this.bookIds.forEach((e) => {
      ids.push(ObjectId(e));
    });

    // Filter to the correct index and grab that many books.
    return db.collection('books')
      .find({ _id: { $in: ids } })
      .skip((this.pageNumber - 1) * this.booksPerPage)
      .limit(this.booksPerPage)
      .toArray()
      .then((b) => {
        this.books = b;
        return 200;
      })
      .catch((err) => 404);
  }

  // Find a collection and by owner and its name
  public async FindCollection(user: string, name: string): Promise <boolean> {
    const db = getDb();

    const collection = await db.collection('collections').findOne({ user, name });

    if (collection) {
      // eslint-disable-next-line no-underscore-dangle
      this.id = collection._id.toHexString();
      this.name = collection.name;
      this.user = collection.user;
      this.bookIds = collection.bookIds;
      return true;
    }
    return false;
  }

  // Find a collection by its ObjectID
  public async FindCollectionById(id: string): Promise <boolean> {
    const db = getDb();

    try {
      const collection = await db.collection('collections').findOne({ _id: ObjectId(id) });
      if (collection) {
        // eslint-disable-next-line no-underscore-dangle
        this.id = collection._id.toString();
        this.name = collection.name;
        this.user = collection.user;
        this.bookIds = collection.bookIds;
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  }

  // Add a book to a collection
  public async AddBook(book: string): Promise <boolean> {
    if (this.bookIds.includes(book)) {
      return true;
    }

    this.bookIds.push(book);
    const db = getDb();

    return db.collection('collections')
      .updateOne({ _id: ObjectId(this.id) }, { $set: { bookIds: this.bookIds } })
      .then(() => true).catch(() => false);
  }

  // Save a new collection and return its id.
  public async NewCollection(name: string, user: string, bookIds: string[]): Promise <string> {
    this.name = name;
    this.user = user;
    this.bookIds = bookIds;

    const db = getDb();
    return db.collection('collections').insertOne({ name, user, bookIds })
      .then((result) => String(result.insertedId)).catch(() => '');
  }
}
