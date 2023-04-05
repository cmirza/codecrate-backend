import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db';
import { Snippet, SnippetInput } from '../models/snippet';

const router = express.Router();
const snippetsCollection = 'snippets';

// Create a snippet
router.post('/', async (req, res) => {
  const snippetInput: SnippetInput = req.body;
  const db = await getDb();
  console.log('db:', db);
  const result = await db.collection(snippetsCollection).insertOne(snippetInput);
  const snippet: Snippet = { ...snippetInput, _id: result.insertedId };
  res.status(201).send(snippet);
});


// Get all snippets for a user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const db = await getDb();
  const snippets = await db
    .collection(snippetsCollection)
    .find({ userId })
    .skip(skip)
    .limit(limit)
    .toArray();
  res.send(snippets);
});

// Update a snippet
router.put('/:snippetId', async (req, res) => {
  const snippetId = new ObjectId(req.params.snippetId);
  const snippetUpdate: Partial<SnippetInput> = req.body;
  const db = await getDb();
  await db.collection(snippetsCollection).updateOne({ _id: snippetId }, { $set: snippetUpdate });
  const updatedSnippet = await db.collection(snippetsCollection).findOne({ _id: snippetId });
  res.send(updatedSnippet);
});

// Delete a snippet
router.delete('/:snippetId', async (req, res) => {
  const snippetId = new ObjectId(req.params.snippetId);
  const db = await getDb();
  await db.collection(snippetsCollection).deleteOne({ _id: snippetId });
  res.sendStatus(204);
});

export default router;
