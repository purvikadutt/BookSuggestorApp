import { getDb } from '../db';

/**
 * @class UserModel
 */
export default class UserModel {
  public id: string;

  public userName: string;

  public role: string;

  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */

  constructor(username: string, role: string) {
    // initialize variables
    this.id = '';
    this.userName = username;
    this.role = role;
  }

  async GetUser(name: string): Promise<number> {
    const db = getDb();
    const user = await db.collection('users').findOne({ userName: name });
    if (user) {
      // eslint-disable-next-line no-underscore-dangle
      this.id = user._id.toString();
      this.userName = name;
      this.role = user.role;
      return 200;
    }

    return 404;
  }

  GetId(): string {
    return this.id;
  }
}
