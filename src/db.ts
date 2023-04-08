import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || '';
const client = new MongoClient(uri);

let db: Db;

export const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export const getDb = () => {
  if (!db) {
    console.log('client:', client);
    console.log('db:', db);
  }
  return db;
};
