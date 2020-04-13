import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { NextFunction } from 'express';
import session from 'express-session';
import logger from 'morgan';
import path from 'path';
import errorHandler from 'errorhandler';

/**
 * The database client
 */

/**
 * Routing Imports
 */
import AdminController from './controllers/AdminController';
import CollectionController from './controllers/CollectionController';
import SessionController from './controllers/SessionController';
import BookController from './controllers/BookController';
import CatalogueController from './controllers/CatalogueController';
import CommentController from './controllers/CommentController';
import ReviewController from './controllers/ReviewController';
import UserController from './controllers/UserController';
import IndexRoute from './controllers/IndexRoute';
import ReviewCollectionController from './controllers/ReviewCollectionController';

import { initDb } from './db';
import RatingController from './controllers/RatingController';

interface ResponseError extends Error {
  status?: number;
}

/**
 * The App.
 *
 * @class App
 */
export class App {
  public app: express.Application;

  /**
     * Constructor.
     *
     * @class App
     * @constructor
     */
  constructor() {
    // create expressjs application
    this.app = express();

    // configure application
    this.config();

    // initialize database
    initDb();

    // add routes
    this.routes();
  }

  /**
     * Configure application
     *
     * @class App
     * @method config
     */
  public config(): void {
    this.app.set('port', 3000);

    // add static paths
    this.app.use(express.static(path.join(__dirname, 'public')));

    // configure pug
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'pug');

    // mount logger
    this.app.use(logger('dev'));

    // mount json form parser
    this.app.use(bodyParser.json());

    // mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));

    // mount cookie parser middleware
    this.app.use(cookieParser('supersecret'));

    // catch 404 and forward to error handler
    this.app.use((
      err: ResponseError,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      err.status = 404;
      next(err);
    });

    // error handling
    this.app.use(errorHandler());

    // initializing express sessions
    this.app.use(session({
      secret: 'thisistotallyasupersecretvaluethatisdefinitelysecure',
      resave: true,
      saveUninitialized: true,
      // name: 'user_sid',
    }));

    // Pass session to body
    this.app.use((req, res, next) => {
      res.locals.session = req.session;
      next();
    });

    // Middleware to clear stale cookies
    this.app.use((req, res, next) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (req.cookies.user_sid && !req.session!.user) {
        res.clearCookie('user_sid');
      }
      next();
    });
  }

  /**
     * Create and return Router.
     *
     * @class App
     * @method routes
     * @return void
     */
  private routes(): void {
    const router = express.Router();

    IndexRoute.create(router);
    AdminController.create(router);
    BookController.create(router);
    CatalogueController.create(router);
    CollectionController.create(router);
    CollectionController.create(router);
    CommentController.create(router);
    RatingController.create(router);
    ReviewController.create(router);
    ReviewCollectionController.create(router);
    SessionController.create(router);
    UserController.create(router);

    // use router middleware
    this.app.use(router);
  }
}

export default new App().app;
