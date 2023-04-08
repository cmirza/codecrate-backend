import { MongoClient, MongoClientOptions } from 'mongodb';

const MONGO_URI = 'mongodb+srv://codecrate:56vknTGJTB1sWgg3@cluster0.igcawnq.mongodb.net/?retryWrites=true&w=majority';
const DATABASE_NAME = 'test';
const SNIPPETS_COLLECTION = 'snippets';
const LANGUAGE_TO_ADD = 'javascript';

async function main() {
    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions);

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const snippetsCollection = db.collection(SNIPPETS_COLLECTION);

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
