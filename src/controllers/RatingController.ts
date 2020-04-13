
import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';

import BookModel from '../models/BookModel';
import RatingModel from '../models/RatingModel';

import { checkUser } from '../users';

/**
   * / route
   *
   * @class RatingController
   */
export default class RatingController extends BaseRoute {
  /**
       * Create the routes.
       *
       * @class RatingController
       * @method create
       * @static
       */
  public static create(router: Router): void {
    // log
    console.log('[RatingController::create] Creating Rating route.');

    // add update rating route
    router.post('/rate', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new RatingController().UpdateRating(req, res, next);
    });
  }

  /**
       * Constructor
       *
       * @class RatingController
       * @constructor
       */
  constructor() {
    super();
  }

  public async UpdateRating(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { session } = req;

    if (!req.body.rating || !req.body.bookId) {
      const options: Record<string, any> = {
        message: '500: Rating could not be made.',
        foundBook: true,
      };
      this.render(req, res, '404page', options);
    }

    const { bookId } = req.body;
    const rating = parseInt(req.body.rating, 10);

    const book = new BookModel();
    const status = await book.GetBookData(bookId);

    if (status === 404) {
      const options: Record<string, any> = {
        message: '404: Book requested does not exist.',
        foundBook: true,
        book,
      };
      this.render(req, res, '404page', options);
    }
    if (session) {
      const data = new RatingModel(session.user, bookId, rating);
      await data.UpdateRating();
      await book.SetOverallRating();
    }

    res.redirect(`/book/${bookId}`);
  }
}
