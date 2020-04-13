
import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';
import BookModel from '../models/BookModel';
import CommentModel from '../models/CommentModel';

// import { checkUser } from '../users';

/**
 * / route
 *
 * @class CommentController
 */
export default class CommentController extends BaseRoute {
  /**
     * Create the routes.
     *
     * @class CommentController
     * @method create
     * @static
     */
  public static create(router: Router): void {
    // log
    console.log('[CommentController::create] Creating Comment route.');

    // add comment view route
    router.post('/comment', (req: Request, res: Response, next: NextFunction) => {
      new CommentController().AddComment(req, res, next);
    });
  }

  /**
     * Constructor
     *
     * @class CommentController
     * @constructor
     */
  constructor() {
    super();
  }


  public async AddComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { session } = req;
    if (session) {
      const commentModel = new CommentModel(req.body.bookId, session.user, req.body.content);

      const book = new BookModel();
      const status = await book.GetBookData(req.body.bookId);

      if (status === 404) {
        const options: Record<string, any> = {
          message: '404: Book requested does not exist.',
          foundBook: true,
          book,
        };
        this.render(req, res, '404page', options);
      }
      const result = await commentModel.AddComment();
      if (result === 500) {
        const options: Record<string, any> = {
          message: '404: Book requested does not exist.',
          foundBook: true,
          book,
        };
        this.render(req, res, '404page', options);
      } else {
        res.redirect(`/book/${book.id}`);
      }
    }
  }
}
