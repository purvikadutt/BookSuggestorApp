
import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';
import UserModel from '../models/userModel';

/**
 * / route
 *
 * @class SessionController
 */
export default class SessionController extends BaseRoute {
  /**
     * Create the routes.
     *
     * @class SessionController
     * @method create
     * @static
     */
  public static create(router: Router): void {
    // log
    console.log('[SessionController::create] Creating Session route.');

    // add login page route
    router.get('/login', (req: Request, res: Response, next: NextFunction) => {
      new SessionController().getLoginPage(req, res, next);
    });

    // login attempt
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
      new SessionController().login(req, res, next);
    });

    // add logout button route
    router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
      new SessionController().logout(req, res, next);
    });
  }

  /**
     * Constructor
     *
     * @class SessionController
     * @constructor
     */
  constructor() {
    super();
  }

  /**
     * The login page route.
     *
     * @class SessionController
     * @method login
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    // set custom title
    this.title = 'login | This is the login page.';

    const sess = req.session;

    if (sess && sess.user) { res.redirect('/catalogue'); }

    const userModel = new UserModel('', '');
    const status = await userModel.GetUser(req.body.userName);
    if (status === 200) {
      if (sess) {
        sess.loggedin = true;
        sess.user = req.body.userName;
        sess.userid = userModel.GetId();
        res.redirect('/catalogue');
        // this.title = 'Booker App';

        // // set message
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const options: Record<string, any> = {
        //   message: 'You\'ve been successfully logged in!',
        // };

        // // render template
        // this.render(req, res, 'index', options);
      }
    } else if (status === 404) {
      // invalid username
      res.status(403);
      const options: Record<string, any> = {
        message: '403: Not a valid user',
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


  /**
  * The login page route.
  *
  * @class SessionController
  * @method login
  * @param req {Request} The express Request object.
  * @param res {Response} The express Response object.
  * @next {NextFunction} Execute the next method.
  */
  public getLoginPage(req: Request, res: Response, next: NextFunction): void {
  // set custom title
    this.title = 'login | This is the login page.';

    const options: Record<string, any> = {
      message: 'Enter a username',
    };

    this.render(req, res, 'login', options);
  }

  /**
     * The logout button route.
     *
     * @class SessionController
     * @method logout
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
  public logout(req: Request, res: Response, next: NextFunction): void {
    this.title = 'logout';

    const sess = req.session;

    if (sess) {
      sess.user = undefined;
      sess.userid = undefined;
      sess.loggedin = false;
      // const { session } = req;
      // deleteFromCache(session.userName);
    }
    res.redirect('/login');
  }
}
