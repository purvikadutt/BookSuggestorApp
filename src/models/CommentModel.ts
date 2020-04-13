
// import fs from 'fs';
import { getDb } from '../db';

/**
 * @class CommentModel
 */
export default class CommentModel {
  public bookId: string;

  public userId: string;

  public content: string;

  public date: string;

  /**
 * Constructor
 *
 * @class BaseRoute
 * @constructor
 */
  constructor(bookId: string, userId: string, content: string) {
  // initialize variables
    this.bookId = bookId;
    this.userId = userId;
    this.content = content;
    this.date = '';
  }


  // Update an entry for a comment in the database.
  public async AddComment(): Promise<number> {
    const db = getDb();
    return db.collection('comments').insertOne(this).then(() => 200).catch(() => 500);
  }
}
