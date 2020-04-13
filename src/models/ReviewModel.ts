import { getDb } from '../db';

const ObjectId = require('mongodb').ObjectID;

/**
 * @class ReviewModel
 */
export default class ReviewModel {
  public id: string;

  public bookId: string;

  public bookTitle: string;

  public username: string;

  public review: string;

  public rating: number;

  public reportedBy: string[];
  /**
 * Constructor
 *
 * @class BaseRoute
 * @constructor
 */

  constructor() {
    // initialize variables
    this.id = '';
    this.bookId = '';
    this.bookTitle = '';
    this.username = '';
    this.review = '';
    this.rating = -1;
    this.reportedBy = [];
  }

  public async setReviewData(
    id: string,
    bookTitle: string,
    username: string,
    review: string,
    rating: number,
  ): Promise<boolean> {
    const db = getDb();
    const bookId = await db.collection('books').findOne({ title: bookTitle });
    if (bookId) {
      this.id = id;
      // eslint-disable-next-line no-underscore-dangle
      this.bookId = bookId._id;
      this.bookTitle = bookTitle;
      this.username = username;
      this.review = review;
      this.rating = rating;
      this.reportedBy = [];
      return true;
    }
    return false;
  }

  public async getReviewData(id: string): Promise<number> {
    const db = getDb();

    const review = await db.collection('reviews').findOne({ _id: ObjectId(id) });
    if (review) {
      // eslint-disable-next-line no-underscore-dangle
      this.id = review._id.toString();
      this.bookId = review.bookId;
      this.bookTitle = review.bookTitle;
      this.username = review.username;
      this.review = review.review;
      this.rating = review.rating;
      this.reportedBy = review.reportedBy;
      return 200;
    }
    return 404;
  }

  // validate review inputs
  public async ValidateReviewData(): Promise<boolean> {
    // id does not need validation as it is dynamically assigned when saving

    // bookId validation
    if (this.bookId === '') {
      console.log('no bookid');
      return false;
    }

    if (this.username === '') {
      console.log('no username');
      return false;
    }

    // review validation
    if (this.review === '') {
      console.log('no review');
      return false;
    }

    // review validation
    if (this.rating === -1) {
      console.log('no rating');
      return false;
    }

    // validation passed
    return true;
  }

  // save review to book
  public async SaveNewReview(): Promise<number> {
    const db = getDb();
    // eslint-disable-next-line no-underscore-dangle
    return db.collection('reviews').insertOne(this).then(() => 200).catch((e) => {
      console.log(e);
      return 500;
    });
  }

  public async ReportReview(username: string): Promise<number> {
    const db = getDb();
    if (username === '') {
      return 500;
    }
    const prevReported = this.reportedBy.filter((prevUser) => prevUser === username);
    if (prevReported.length > 0) {
      // user already reported this review
      return 403;
    }
    this.reportedBy.push(username);

    const update = await db.collection('reviews').updateOne({ _id: ObjectId(this.id) }, { $set: { reportedBy: this.reportedBy } });
    if (update) {
      // success
      return 200;
    }
    // update failed
    return 500;
  }
}
