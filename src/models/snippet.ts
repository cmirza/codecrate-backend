import { ObjectId } from 'mongodb';

export interface Snippet {
  _id: ObjectId;
  title: string;
  content: string;
  collection: string;
  email: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SnippetInput {
  title: string;
  content: string;
  collection: string;
  email: string;
  language: string;
}
