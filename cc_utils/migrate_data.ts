import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const collectionName = 'users'; // update this to the name of the collection you want to migrate

(async () => {
  try {
    // Connect to the MongoDB instance
    const client = new MongoClient(uri, { useUnifiedTopology: true } as any);
    await client.connect();
    console.log('Connected to the MongoDB instance.');

    // Access the 'test' and 'codecrate' databases
    const testDb = client.db('test');
    const codeCrateDb = client.db('codecrate');

    // Migrate data from 'snippets' collection in 'test' database to 'codecrate' database
    const snippets = await testDb.collection(collectionName).find().toArray();
    if (snippets.length > 0) {
      const result = await codeCrateDb.collection(collectionName).insertMany(snippets);
      console.log(`Successfully migrated ${result.insertedCount} documents from 'test' to 'codecrate' database.`);
    } else {
      console.log("No documents found in 'test' database. No migration needed.");
    }

    // Close the connection
    await client.close();
  } catch (error) {
    console.error('Error migrating data:', error);
  }
})();
