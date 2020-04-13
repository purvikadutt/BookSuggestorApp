import {
  NextFunction, Request, Response, Router,
} from 'express';
import { checkUser } from '../users';
import BaseRoute from './route';
import ReviewCollectionModel from '../models/ReviewCollectionModel';

const reviewsPerPage = 5;

/**
 * / route
 *
 * @class ReviewCollectionController
 */
export default class ReviewCollectionController extends BaseRoute {
  /**
     * Create the routes.
     *
     * @class ReviewCollectionController
     * @method create
     * @static
     */
  public static create(router: Router): void {
    // log
    console.log('[ReviewCollectionController::create] Creating Review Collection route.');

    // add reviews page route
    router.get(
      '/reviews', checkUser,
      (req: Request, res: Response, next: NextFunction) => {
        new ReviewCollectionController().GetReviews(req, res, next, true);
      },
    );

    // add pagination route
    router.get(
      '/reviews/:pageNumber', checkUser,
      (req: Request, res: Response, next: NextFunction) => {
        new ReviewCollectionController().GetReviews(req, res, next, false);
      },
    );
  }

  /**
     * Constructor
     *
     * @class ReviewCollectionController
     * @constructor
     */
  constructor() {
    super();
  }

  /**
     * The reviews page route.
     *
     * @class ReviewCollectionController
     * @method GetReviews
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
  public async GetReviews(
    req: Request,
    res: Response,
    next: NextFunction,
    baseUrl: boolean,
  ): Promise<void> {
    // set custom title
    this.title = 'Reviews';

    const newReviews = new ReviewCollectionModel();

    let pageNumber = 1;
    if (!baseUrl) {
      pageNumber = parseInt(req.params.pageNumber, 10);
    }
    const status = await newReviews.GetReviews(reviewsPerPage, pageNumber);

    if (status === 200) {
      // render template
      res.status(200);
      const options: Record<string, any> = {
        reviews: newReviews.reviews,
        totalPages: newReviews.totalPages,
        pageNumber: newReviews.pageNumber,
      };
      this.render(req, res, 'reviews', options);
    } else if (status === 404) {
      // invalid page requested
      res.status(404);
      const options: Record<string, any> = {
        message: '404: Invalid Page Requested',
      };
      this.render(req, res, '404Page', options);
    } else {
      // some sort of error occured
      const options: Record<string, any> = {
        message: 'an error has occured',
      };
      this.render(req, res, 'error', options);
    }
  }
}
