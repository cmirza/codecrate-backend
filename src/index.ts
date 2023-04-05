require('dotenv').config({path:'.env'});
import express from 'express';
import cors from 'cors';
import app from './app';
import { connectToDatabase } from './db';

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, CodeCrate!');
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
