import ReviewModel from './ReviewModel';
import { getDb } from '../db';

/**
 * @class ReviewCollectionModel
 */
export default class ReviewCollectionModel {
  public reviews: ReviewModel[];

  public pageNumber: number;

  public totalPages: number;

  public reviewsPerPage: number;

  public totalReviews: number;

  /**
   * Constructor
   *
   * @class BookModel
   * @constructor
   */
  constructor() {
    // initialize variables
    this.reviews = [];
    this.pageNumber = 1;
    this.totalPages = -1;
    this.reviewsPerPage = -1;
    this.totalReviews = -1;
  }


  /**
   * GetReviews
   * Sets and Gets single page worth of review data
   */
  async GetReviews(perPage: number, pageNum: number): Promise<number> {
    const db = getDb();

    // If we don't know a page count, or if the booksPerPage has been changed, re-calc page numbers.
    if (this.totalPages === -1 || this.reviewsPerPage !== perPage) {
      this.reviewsPerPage = perPage;
      this.totalReviews = await db.collection('reviews').count();
      this.totalPages = Math.ceil(this.totalReviews / this.reviewsPerPage);
    }

    // 404 for invalid pages
    if (pageNum > this.totalPages || pageNum < 1) {
      return 404;
    }

    this.pageNumber = pageNum;

    // Filter to the correct index and grab that many books.
    const reviews = await db.collection('reviews')
      .find()
      .skip((this.pageNumber - 1) * this.reviewsPerPage)
      .limit(this.reviewsPerPage)
      .toArray();
    for (let i = 0; i < reviews.length; i += 1) {
      const model = new ReviewModel();
      // eslint-disable-next-line no-underscore-dangle, max-len, no-await-in-loop
      if (await model.setReviewData(reviews[i]._id, reviews[i].bookTitle, reviews[i].username, reviews[i].review, reviews[i].rating)) {
        this.reviews.push(model);
      } else {
        console.log(`could not find ${reviews[i].bookTitle} in database`);
      }
    }

    return 200;
  }
}
