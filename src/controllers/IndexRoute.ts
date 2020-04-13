
import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';
import { checkUser } from '../users';

/**
 * / route
 *
 * @class IndexRoute
 */
export default class IndexRoute extends BaseRoute {
  /**
     * Create the routes.
     *
     * @class IndexRoute
     * @method create
     * @static
     */
  public static create(router: Router): void {
    // log
    console.log('[IndexRoute::create] Creating index route.');

    // add home page route
    router.get('/', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().index(req, res, next);
    });
  }

  /**
     * Constructor
     *
     * @class IndexRoute
     * @constructor
     */
  constructor() {
    super();
  }

  /**
     * The home page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
  public index(req: Request, res: Response, next: NextFunction): void {
    // set custom title
    this.title = 'Home | This is the main page';

    // set message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: Record<string, any> = {
      message: 'Welcome to Booker',
    };

    // render template
    this.render(req, res, 'index', options);
  }
}
