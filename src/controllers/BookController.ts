
import {
  NextFunction, Request, Response, Router,
} from 'express';
import BaseRoute from './route';
import BookModel from '../models/BookModel';
import { checkUser } from '../users';
import RatingModel from '../models/RatingModel';
import CollectionsModel from '../models/CollectionsModel';

/**
 * / route
 *
 * @class BookController
 */
export default class BookController extends BaseRoute {
  /**
     * Create the routes.
     *
     * @class BookController
     * @method create
     * @static
     */
  public static create(router: Router): void {
    // log
    console.log('[BookController::create] Creating Book route.');

    // add book view route
    router.get('/book/:bookId', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new BookController().GetBookInstance(req, res, next);
    });

    // add add book view route
    router.get('/addBook', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new BookController().CreateNewBook(req, res, next);
    });

    // add save new book route
    router.post('/addBook', checkUser, (req: Request, res: Response, next: NextFunction) => {
      new BookController().SaveNewBook(req, res, next);
    });
  }

  /**
     * Constructor
     *
     * @class BookController
     * @constructor
     */
  constructor() {
    super();
  }


  // book view
  public async GetBookInstance(req: Request, res: Response, next: NextFunction): Promise<void> {
    const book = new BookModel();
    const rating = new RatingModel('', '', 0);

    // set custom title
    this.title = 'book | Book information';
    let options: Record<string, any> = {
      message: '',
      foundBook: false,
    };

    if (!req.session) {
      this.render(req, res, '404page', options);
      return;
    }

    // Fetch book data and set page info
    const status = await book.GetBookData(req.params.bookId);
    if (status === 404) {
      options = {
        message: 'That book does not exist.',
        foundBook: false,
      };
      this.render(req, res, '404page', options);
      return;
    }

    const col = new CollectionsModel();
    await col.GetCollections(req.session.userid);

    const haveRated = await rating.GetUsersRating(req.session.user, book.id);
    const myRating = (haveRated) ? rating.rating : false;

    await book.GetBookDiscussion();

    options = {
      message: 'That book does not exist.',
      foundBook: false,
      book,
      myRating,
      myCollections: col.collections,
    };

    // set custom title
    this.title = book.title;

    // render template
    this.render(req, res, 'bookView', options);
  }

  // add book view
  public CreateNewBook(req: Request, res: Response, next: NextFunction): void {
    // set custom title
    this.title = 'Add New Book| Please add new book';

    // set message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: Record<string, any> = {
      message: 'Add a book',
    };

    // render template
    this.render(req, res, 'addBookView', options);
  }

  // save book
  public async SaveNewBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    // set custom title
    this.title = 'Add New Book| Please add new book';
    const newTitle = req.body.title;
    const newAuthor = req.body.author;
    const newCover = req.body.cover;
    const newIsbn = req.body.isbn;
    const newSynopsis = req.body.synopsis;
    const newBook = new BookModel();

    newBook.setBookData(newTitle, newCover, newAuthor,
      newIsbn, newSynopsis, 0);

    if (await newBook.ValidateBookData()) {
      const status = await newBook.SaveNewBook();
      if (status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: Record<string, any> = {
          message: 'Book added successfully',
        };

        this.render(req, res, 'addBookView', options);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: Record<string, any> = {
          message: 'An error occured while attempting to save the book',
        };

        this.render(req, res, 'addBookView', options);
      }
    } else {
      // TODO: change validate to return some useful information as to why it failed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: Record<string, any> = {
        message: 'Invalid format of one or more inputs',
      };

      this.render(req, res, 'addBookView', options);
    }
  }
}
