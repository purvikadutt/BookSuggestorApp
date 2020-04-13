import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';
import CatalogueModel from '../models/CatalogueModel';
import { checkUser } from '../users';

const booksPerPage = 5;
/**
 * / route
 *
 * @class CatalogueController
 */
export default class CatalogueController extends BaseRoute {
  /**
   * Create the routes.
   *
   * @class CatalogueController
   * @method create
   * @static
   */
  public static create(router: Router): void {
    // log
    console.log('[CatalogueController::create] Creating Catalogue route.');

    // add catalogue page route
    router.get(
      '/catalogue',
      checkUser,
      (req: Request, res: Response, next: NextFunction) => {
        new CatalogueController().GetBookData(req, res, next, true);
      },
    );

    // add pagination route
    router.get(
      '/catalogue/:pageNumber',
      checkUser,
      (req: Request, res: Response, next: NextFunction) => {
        new CatalogueController().GetBookData(req, res, next, false);
      },
    );
  }

  /**
   * Constructor
   *
   * @class CatalogueController
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The catalogue page route.
   *
   * @class CatalogueController
   * @method GetBookData
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public async GetBookData(
    req: Request,
    res: Response,
    next: NextFunction,
    baseUrl: boolean,
  ): Promise<void> {
    // set custom title
    this.title = 'Catalogue';

    // set message
    const dataModel = new CatalogueModel();
    // data.Populate();

    let pageNumber = 1;
    if (!baseUrl) {
      pageNumber = parseInt(req.params.pageNumber, 10);
    }
    const status = await dataModel.GetBookData(booksPerPage, pageNumber);
    if (status === 200) {
      // render template
      const options: Record<string, any> = {
        urlPath: '/catalogue/',
        data: dataModel.books,
        totalPages: dataModel.totalPages,
        pageNumber: dataModel.pageNumber,
      };
      this.render(req, res, 'collageView', options);
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
