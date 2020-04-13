import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';
import { checkUser } from '../users';
import ReviewModel from '../models/ReviewModel';
import RatingModel from '../models/RatingModel';
import BookModel from '../models/BookModel';


/**
 * / route
 *
 * @class ReviewController
 */
export default class ReviewController extends BaseRoute {
  /**
     * Create the routes.
     *
     * @class ReviewController
     * @method create
     * @static
     */
  public static create(router: Router): void {
    // log
    console.log('[ReviewController::create] Creating Review route.');

    // add add review view route
    router.get('/addReview', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new ReviewController().CreateReview(req, res, next);
    });

    // add new review route
    router.post('/addReview', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new ReviewController().SaveNewReview(req, res, next);
    });

    // add report review route
    router.get('/report/:reviewId/:pageNumber', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new ReviewController().ReportReview(req, res, next);
    });
  }


  /**
     * Constructor
     *
     * @class ReviewController
     * @constructor
     */
  constructor() {
    super();
  }

  /**
     * The review view route.
     *
     * @class ReviewController
     * @method GetBookReviews
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
  public CreateReview(req: Request, res: Response, next: NextFunction): void {
    // set custom title
    this.title = 'Review | This is the reviews view';

    // set message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let options: Record<string, any>;

    if (req.query.bookId) {
      options = {
        message: 'Add a review',
        fromBook: true,
        book: {
          id: req.query.bookId,
          title: req.query.bookTitle,
          rating: req.query.rating,
        },
      };
    } else {
      options = {
        message: 'Add a review',
      };
    }

    // render template
    this.render(req, res, 'addReview', options);
  }

  // save review
  public async SaveNewReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    // set custom title
    if (req.session) {
      this.title = 'Add Book Review| Please add review';
      const newReviews = new ReviewModel();

      await newReviews.setReviewData('', req.body.bookTitle, req.session.user,
        req.body.review, req.body.rating);

      if (await newReviews.ValidateReviewData()) {
        const status = await newReviews.SaveNewReview();

        if (status === 200) {
          const rating = parseInt(req.body.rating, 10);

          const data = new RatingModel(req.session.user, newReviews.bookId.toString(), rating);
          const book = new BookModel();

          await book.GetBookData(newReviews.bookId);
          await data.UpdateRating();
          await book.SetOverallRating();

          const options: Record<string, any> = {
            message: 'Review added successfully',
          };

          this.render(req, res, 'addReview', options);
        } else {
          const options: Record<string, any> = {
            message: 'An error occured while attempting to save the review',
          };

          this.render(req, res, 'addReview', options);
        }
      } else {
        // TODO: change validate to return some useful information as to why it failed
        const options: Record<string, any> = {
          message: 'Invalid format of one or more inputs',
        };

        this.render(req, res, 'addReview', options);
      }
      return;
    }
    // session doesnt exist redirect to login?
    res.redirect('/login');
  }


  public async ReportReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.session) {
      const { session } = req;

      const review = new ReviewModel();
      const status = await review.getReviewData(req.params.reviewId);
      let options: Record<string, any>;
      const page = parseInt(req.params.pageNumber, 10) ? 1 : parseInt(req.params.pageNumber, 10);
      if (status === 200) {
        const result = await review.ReportReview(session.user);
        // eslint-disable-next-line max-len
        if (result === 200) {
          // success
          options = {
            message: 'thank you for your report. Our admins will review this content promptly.',
            pageNumber: page,
          };
        } else if (result === 403) {
          // already reported
          options = {
            message: 'You have already reported this review.',
            pageNumber: page,
          };
        } else if (result === 500) {
          // error
          options = {
            message: 'An error occured while trying to submit the report.',
            pageNumber: page,
          };
        } else {
          // otherwise 404
          options = {
            message: 'Review does not exist.',
            pageNumber: page,
          };
        }
      } else {
        // error
        options = {
          message: 'An error occured while trying to find review.',
          pageNumber: page,
        };
      }
      this.render(req, res, 'reportResult', options);
    }
  }
}
