import { getDb } from '../db';

/**
 * @class UserModel
 */
export default class CollectionsModel {
  public collections: Record<string, any>[];

  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */

  constructor() {
    // initialize variables
    this.collections = [];
  }

  async GetCollections(user: string): Promise<boolean> {
    const db = getDb();

    this.collections = await db.collection('collections')
      .find({ user })
      .project({ _id: 1, name: 1 })
      .toArray();
    return (this.collections.length !== 0);
  }

  async GetAllCollections(): Promise<boolean> {
    const db = getDb();

    this.collections = await db.collection('collections')
      .find()
      .project({ _id: 1, user: 1, name: 1 })
      .toArray();
    return (this.collections.length !== 0);
  }
}
