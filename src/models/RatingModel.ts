import { getDb } from '../db';

/**
 * @class RatingModel
 */
export default class RatingModel {
  public bookId: string;

  public user: string;

  public rating: number;

  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */
  constructor(
    user: string,
    bookId: string,
    rating: number,
  ) {
    // initialize variables
    this.bookId = bookId;
    this.user = user;
    this.rating = rating;
  }

  // Retrieve the rating a user assigned to the book
  public async GetUsersRating(user: string, bookId: string): Promise<boolean> {
    const db = getDb();

    const userRating = await db.collection('ratings').findOne({ user, bookId });

    if (!userRating) {
      return false;
    }

    this.bookId = userRating.bookId;
    this.user = userRating.user;
    this.rating = userRating.rating;

    return true;
  }

  // Update an entry for a rating in the database.
  public async UpdateRating(): Promise<number> {
    const db = getDb();
    const { user, bookId, rating } = this;

    // limit rating bounds to a 5 point scale
    if (rating > 5) { this.rating = 5; }
    if (rating < 0) { this.rating = 0; }

    return db.collection('ratings')
      .updateOne({ user, bookId }, { $set: { rating } }, { upsert: true })
      .then(() => 200).catch(() => 500);
  }
}
