import express from 'express';
import cors from 'cors';
import app from './app';

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, CodeCrate!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});