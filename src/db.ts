import { MongoClient, Db } from 'mongodb';
import assert from 'assert';

let db: Db;

export const initDb = async (dbName = 'booker-prod'): Promise <void> => {
  console.log('Connecting to MongoDB');
  try {
    if (db) {
      console.warn('Database has already been initialized, trying to call again.');
    } else {
      // const client = await MongoClient.connect('mongodb+srv://Admin:test@cluster0-d1tc3.mongodb.net/test?retryWrites=true&w=majority');
      // const client = await MongoClient.connect('mongodb://localhost:27017');
      const client = await MongoClient.connect('mongodb+srv://booker:bQ0dIkrP1qJfAfCZ@booker0-j8ms2.mongodb.net/test?retryWrites=true&w=majority');
      db = client.db(dbName);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getDb = (): Db => {
  assert(db, 'No connection to database, ensure initDb() is called first.');

  return db;
};
