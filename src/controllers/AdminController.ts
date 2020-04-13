
import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';
import AdminDataModel from '../models/adminDataModel';


/**
 * / route
 *
 * @class AdminController
 */
export default class AdminController extends BaseRoute {
  /**
     * Create the routes.
     *
     * @class AdminController
     * @method create
     * @static
     */
  public static create(router: Router): void {
    // log
    console.log('[AdminController::create] Creating Admin route.');

    // add admin page route
    // router.get('/admin', (req: Request, res: Response, next: NextFunction) => {
    //   new AdminController().GetAdminInfo(req, res, next);
    // });

    // add delete review route
    router.get('/deleteReview/:reviewId',
      (req: Request, res: Response, next: NextFunction) => {
        if (req.session) {
          if (req.session.user === 'admin') {
            next();
          } else {
            new AdminController().noAuth(req, res, next);
          }
        }
      },
      (req: Request, res: Response, next: NextFunction) => {
        new AdminController().DeleteReview(req, res, next);
      });

    // add admin page route
    router.get('/admin',
      (req: Request, res: Response, next: NextFunction) => {
        if (req.session) {
          if (req.session.user === 'admin') {
            next();
          } else {
            new AdminController().noAuth(req, res, next);
          }
        }
      },
      (req: Request, res: Response, next: NextFunction) => {
        new AdminController().GetAdminInfo(req, res, next);
      });
  }

  /**
     * The no auth route.
     *
     * @class AdminController
     * @method noAuth
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
  public noAuth(req: Request, res: Response, next: NextFunction): void {
    // set custom title
    this.title = 'Admin | Unauthorized';

    res.status(403);
    const options: Record<string, any> = {
      message: '403: Unauthorized',
    };
    this.render(req, res, '404Page', options);
  }


  /**
     * The user list page route.
     *
     * @class AdminController
     * @method GetAdminInfo
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
  public async GetAdminInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    const adminModel = new AdminDataModel();
    const userResult = await adminModel.GetAllUsers();
    const reviewsResult = await adminModel.GetReportedReviews();

    if (userResult === 500 || reviewsResult === 500) {
      const options: Record<string, any> = {
        message: 'An Error occurred.',
      };

      // render template
      this.render(req, res, '404Page', options);
      return;
    }

    res.status(200);
    // set custom title
    this.title = 'Admin | This is the User List';

    // set message
    const options: Record<string, any> = {
      message: 'welcome to the admin page',
      users: adminModel.users,
      reviews: adminModel.reportedReviews,
    };

    // render template
    this.render(req, res, 'admin', options);
  }

  public async DeleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    const adminModel = new AdminDataModel();
    const result = await adminModel.DeleteReview(req.params.reviewId);
    if (result === 500) {
      // set message
      const options: Record<string, any> = {
        message: 'Error occurred while attempting to delete review',
      };

      this.render(req, res, '404Page', options);
    } else if (result === 404) {
      // set message
      const options: Record<string, any> = {
        message: 'Deletion was successful but an error occurred while attempting to reload data',
      };

      this.render(req, res, '404Page', options);
    } else {
      const options: Record<string, any> = {
        message: 'Review has been deleted',
        users: adminModel.users,
        reviews: adminModel.reportedReviews,
      };

      // render template
      this.render(req, res, 'admin', options);
    }
  }
}
