
import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';
import { checkUser } from '../users';
import CollectionModel from '../models/CollectionModel';
import CollectionsModel from '../models/CollectionsModel';
import BookModel from '../models/BookModel';

/**
 * / route
 *
 * @class CollectionController
 */
export default class CollectionController extends BaseRoute {
  /**
     * Create the routes.
     *
     * @class CollectionController
     * @method create
     * @static
     */
  public static create(router: Router): void {
    // log
    console.log('[CollectionController::create] Creating Collection route.');

    // add collection view route
    router.get('/collection/:collectionId?/:pageNum?', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new CollectionController().ShowCollection(req, res, next);
    });

    // add a book to a collection
    router.post('/collection', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new CollectionController().AddToCollection(req, res, next);
    });

    // View the collections
    router.get('/collections', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new CollectionController().ShowCollections(req, res, next);
    });

    // add a new collection
    router.post('/collections', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new CollectionController().NewCollection(req, res, next);
    });
  }

  /**
     * Constructor
     *
     * @class CollectionController
     * @constructor
     */
  constructor() {
    super();
  }

  public async AddToCollection(req: Request, res: Response, next: NextFunction): Promise <void> {
    const data = new CollectionModel('', '', [], '');
    // Confirm we received a colId that actually exists.
    if (!(await data.FindCollectionById(req.body.colId))) {
      res.status(500);
      const options: Record<string, any> = {
        message: 'an error has occured',
      };
      this.render(req, res, 'error', options);
      return;
    }

    // Collection exists, does the book?
    const book = new BookModel();
    if (await book.GetBookData(req.body.bookId) !== 200) {
      const options: Record<string, any> = {
        message: 'an error has occured',
      };
      this.render(req, res, 'error', options);
      res.redirect(`/book/${book.id}`);
      return;
    }

    // We have both, do the add.
    await data.AddBook(book.id);
    res.redirect(`/book/${book.id}`);
  }

  /**
     * The collection view route.
     *
     * @class CollectionController
     * @method ShowCollection
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
  public async ShowCollection(req: Request, res: Response, next: NextFunction): Promise <void> {
    // Collection route requires a collectionId, if not provided redirect to collections:
    if (!req.params.collectionId) {
      res.redirect('/collections');
      return;
    }

    // Find the collection requested
    const data = new CollectionModel('', '', [], '');
    const foundCol = await data.FindCollectionById(req.params.collectionId);

    if (!foundCol) {
      res.redirect('/collections');
      return;
    }

    let page = 1;
    if (req.params.pageNum) {
      page = parseInt(req.params.pageNum, 10);
    }

    // Fetch all the books for our collections pagination
    const status = await data.GetBooks(5, page);

    this.title = `Collections | ${data.name}`;

    if (status === 200) {
      res.status(200);
      const options: Record<string, any> = {
        urlPath: `/collection/${req.params.collectionId}/`,
        data: data.books,
        totalPages: data.totalPages,
        pageNumber: data.pageNumber,
      };
      this.render(req, res, 'collageView', options);
    } else if (status === 201) {
      // invalid page requested
      res.status(201);
      const options: Record<string, any> = {
        message: 'This collection is empty, add some books first!',
      };
      this.render(req, res, '404Page', options);
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

  // Collections main page with all collections and the ability to add new collections
  public async ShowCollections(req: Request, res: Response, next: NextFunction): Promise <void> {
    const data = new CollectionsModel();
    await data.GetAllCollections();

    this.title = 'Collections';
    res.status(200);
    const options: Record<string, any> = {
      collections: data.collections,
    };
    this.render(req, res, 'collections', options);
  }

  // Create new collections
  public async NewCollection(req: Request, res: Response, next: NextFunction): Promise <void> {
    const data = new CollectionModel('', '', [], '');

    if (!req.body.collectionname || !req.session) {
      res.redirect('/collections');
      return;
    }

    this.title = 'Adding new collection...';

    const success = await data.NewCollection(req.body.collectionname, req.session.userid, []);

    if (success.length < 1) {
      res.status(500);
      const options: Record<string, any> = {
        message: '500: Collection adding error (already exists)',
      };
      this.render(req, res, '404Page', options);
    }

    res.redirect(`/collection/${success}`);
  }
}
