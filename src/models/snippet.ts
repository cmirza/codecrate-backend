import { ObjectId } from 'mongodb';

export interface Snippet {
  _id: ObjectId;
  title: string;
  content: string;
  collection: string;
  userId: string;
}

export interface SnippetInput {
  title: string;
  content: string;
  collection: string;
  userId: string;
}
