
import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';

/**
 * / route
 *
 * @class UserController
 */
export default class UserController extends BaseRoute {
  /**
     * Create the routes.
     *
     * @class UserController
     * @method create
     * @static
     */
  public static create(router: Router): void {
    // log
    console.log('[UserController::create] Creating registration route.');

    // add registration page route
    router.get('/registration', (req: Request, res: Response, next: NextFunction) => {
      new UserController().registration(req, res, next);
    });
  }

  /**
     * Constructor
     *
     * @class UserController
     * @constructor
     */
  constructor() {
    super();
  }

  /**
     * The registration page route.
     *
     * @class UserController
     * @method registration
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
  public registration(req: Request, res: Response, next: NextFunction): void {
    // set custom title
    this.title = 'User | This is the registration page';

    // set message
    const options: Record<string, any> = {
      message: 'WIP',
    };

    // render template
    this.render(req, res, 'WIP', options);
  }
}
