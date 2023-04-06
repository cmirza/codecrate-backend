import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db';
import { Snippet, SnippetInput } from '../models/Snippet';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const snippetsCollection = 'snippets';

// Create a snippet
router.post('/', authenticate, async (req, res) => {
  const snippetInput: SnippetInput = req.body;
  const currentUser = (req as any).user;
  const db = await getDb();

  const currentTimestamp = new Date();

  const snippetToInsert = { 
    ...snippetInput,
    email: currentUser.email,
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp
  };

  const result = await db.collection(snippetsCollection).insertOne(snippetToInsert);
  const snippet: Snippet = { ...snippetToInsert, _id: result.insertedId };

  res.status(201).send(snippet);
});


// Get all snippets for a user
router.get('/:email', authenticate, async (req, res) => {
  const email = req.params.email
  const currentUser = (req as any).user;

  if (currentUser.email !== email && currentUser.role !== 'admin') {
    return res.status(403).send('Access denied. You can only view your own snippets.');
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const db = await getDb();
  const snippets = await db
    .collection(snippetsCollection)
    .find({ email })
    .skip(skip)
    .limit(limit)
    .toArray();
  res.send(snippets);
});

// Update a snippet
router.put('/:snippetId', authenticate, async (req, res) => {
  const snippetId = new ObjectId(req.params.snippetId);
  const snippetUpdate: Partial<SnippetInput> = req.body;
  const db = await getDb();

  await db.collection(snippetsCollection).updateOne(
    { _id: snippetId },
    { $set: { ...snippetUpdate, updatedAt: new Date() } }
  );
  
  const updatedSnippet = await db.collection(snippetsCollection).findOne({ _id: snippetId });
  res.send(updatedSnippet);
});

// Delete a snippet
router.delete('/:snippetId', authenticate, async (req, res) => {
  const snippetId = new ObjectId(req.params.snippetId);
  const db = await getDb();
  await db.collection(snippetsCollection).deleteOne({ _id: snippetId });
  res.sendStatus(204);
});

export default router;
