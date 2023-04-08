import { MongoClient, MongoClientOptions } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI || '';
const DATABASE_NAME = 'codecrate';
const COLLECTION = 'snippets';
const LANGUAGE_TO_ADD = 'javascript';

async function main() {
    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions);

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const snippetsCollection = db.collection(COLLECTION);

    const result = await snippetsCollection.updateMany(
      { language: { $exists: false } },
      { $set: { language: LANGUAGE_TO_ADD } }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

main();
