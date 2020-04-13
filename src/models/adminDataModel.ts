import { getDb } from '../db';
import UserModel from './userModel';
import ReviewModel from './ReviewModel';

const ObjectId = require('mongodb').ObjectID;

/**
 * @class AdminDataModel
 */
export default class AdminDataModel {
  public users: UserModel[];

  public reportedReviews: ReviewModel[];

  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */

  constructor() {
    // initialize variables
    this.users = [];
    this.reportedReviews = [];
  }

  async GetAllUsers(): Promise<number> {
    const db = getDb();
    try {
      await db.collection('users').find().forEach((user) => this.users.push(user));
      return 200;
    } catch (e) {
      console.log(e);
      return 500;
    }
  }

  async GetReportedReviews(): Promise<number> {
    const db = getDb();
    try {
      const reviews = await db.collection('reviews').find().toArray();
      for (let i = 0; i < reviews.length; i += 1) {
        if (reviews[i].reportedBy.length > 0) {
          // eslint-disable-next-line no-underscore-dangle
          reviews[i].id = reviews[i]._id;
          this.reportedReviews.push(reviews[i]);
        }
      }
      return 200;
    } catch (e) {
      console.log(e);
      return 500;
    }
  }

  async DeleteReview(reviewId: string): Promise<number> {
    const db = getDb();
    try {
      await db.collection('reviews').deleteOne({ _id: ObjectId(reviewId) });
    } catch (e) {
      console.log(e);
      return 500;
    }
    try {
      await this.GetAllUsers();
      await this.GetReportedReviews();
      return 200;
    } catch (e) {
      console.log(e);
      return 404;
    }
  }
}
