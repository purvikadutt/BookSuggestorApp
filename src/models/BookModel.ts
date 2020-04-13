
// import fs from 'fs';
import { getDb } from '../db';
import CommentModel from './CommentModel';

const ObjectId = require('mongodb').ObjectID;
/**
 * @class BookModel
 */
export default class BookModel {
  public id: string;

  public title: string;

  public cover: string;

  public author: string;

  public isbn: number;

  public synopsis: string;

  public rating: number;

  public rates: number;

  public comments: CommentModel[];

  /**
 * Constructor
 *
 * @class BaseRoute
 * @constructor
 */
  constructor() {
  // initialize variables
    this.id = '';
    this.title = '';
    this.cover = '';
    this.author = '';
    this.isbn = 0;
    this.synopsis = '';
    this.rating = 0;
    this.rates = 0;
    this.comments = [];
  }

  public setBookData(
    title: string,
    cover: string,
    author: string,
    isbn: number,
    synopsis: string,
    rating: number,
  ): void {
    this.title = title;
    this.cover = cover;
    this.author = author;
    this.isbn = isbn;
    this.synopsis = synopsis;
    this.rating = rating;
  }

  // Get the average of ratings for this book and update the model.
  public async SetOverallRating(): Promise<number> {
    const db = getDb();

    const avg = await db.collection('ratings').aggregate([
      { $match: { bookId: this.id } },
      { $group: { _id: null, AverageRating: { $avg: '$rating' } } },
    ]).toArray();

    const count = await db.collection('ratings').find({ bookId: this.id }).count();

    this.rating = avg[0].AverageRating;
    this.rates = count;

    return db.collection('books')
      .updateOne({ _id: ObjectId(this.id) }, { $set: { rating: this.rating, rates: this.rates } })
      .then(() => 200).catch(() => 500);
  }

  // validate book inputs
  public async ValidateBookData(): Promise<boolean> {
    // id does not need validation as it is dynamically assigned when saving

    // title validation
    if (this.title === undefined) {
      return false;
    }

    // author validation
    if (this.author === undefined) {
      return false;
    }

    // cover validation
    if (this.cover === undefined) {
      return false;
    }

    // isbn validation
    if (this.isbn === undefined) {
      return false;
    }

    // synopsis validation
    if (this.synopsis === undefined) {
      return false;
    }
    // validation passed
    return true;
  }

  // Fetch the book data for a specific book id.
  // Return 200 if successful or 404 if not found.
  public async GetBookData(id: string): Promise<number> {
    const db = getDb();

    const book = await db.collection('books').findOne({ _id: ObjectId(id) });
    if (book) {
      // eslint-disable-next-line no-underscore-dangle
      this.id = book._id.toString();
      this.title = book.title;
      this.cover = book.cover;
      this.author = book.author;
      this.isbn = book.isbn;
      this.synopsis = book.synopsis;
      this.rating = book.rating;
      this.rates = book.rates;
      return 200;
    }
    return 404;
  }

  // save book to database
  public async SaveNewBook(): Promise<number> {
    const db = getDb();
    // this.id = await db.collection('books').count() + 1;
    return db.collection('books').insertOne(this).then(() => 200).catch(() => 500);
  }

  // Retrieve the comments for a book
  public async GetBookDiscussion(): Promise<number> {
    try {
      const db = getDb();
      await db.collection('comments').find({ bookId: this.id }).sort({ _id: -1 }).forEach((comment) => {
        const model = new CommentModel(comment.bookId, comment.userId, comment.content);
        // eslint-disable-next-line no-underscore-dangle
        model.date = ObjectId(comment._id.toHexString()).getTimestamp();
        this.comments.push(model);
      });
      return 200;
    } catch (e) {
      return 500;
    }
  }
}
