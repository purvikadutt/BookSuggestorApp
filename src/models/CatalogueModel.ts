import BookModel from './BookModel';
import { getDb } from '../db';

/**
 * @class BookModel
 */
export default class CatalogueModel {
  public books: BookModel[];

  public pageNumber: number;

  public totalPages: number;

  public booksPerPage: number;

  public totalBooks: number;

  /**
   * Constructor
   *
   * @class BookModel
   * @constructor
   */
  constructor() {
    // initialize variables
    this.books = [];
    this.pageNumber = 1;
    this.totalPages = -1;
    this.booksPerPage = -1;
    this.totalBooks = -1;
  }

  /**
   * GetBookData
   * Sets and Gets single page worth of catalogue data
   */
  async GetBookData(perPage: number, pageNum: number): Promise<number> {
    const db = getDb();

    // If we don't know a page count, or if the booksPerPage has been changed, re-calc page numbers.
    if (this.totalPages === -1 || this.booksPerPage !== perPage) {
      this.booksPerPage = perPage;
      this.totalBooks = await db.collection('books').count();
      this.totalPages = Math.ceil(this.totalBooks / this.booksPerPage);
    }

    // 404 for invalid pages
    if (pageNum > this.totalPages || pageNum < 1) {
      return 404;
    }

    this.pageNumber = pageNum;

    // Filter to the correct index and grab that many books.
    return db.collection('books')
      .find()
      .skip((this.pageNumber - 1) * this.booksPerPage)
      .limit(this.booksPerPage)
      .toArray()
      .then((b) => {
        this.books = b;
        return 200;
      })
      .catch((err) => 404);
  }
}
