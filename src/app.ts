import express from 'express';
import cors from 'cors';
import snippetsRoutes from './routes/snippets';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/snippets', snippetsRoutes);

export default app;
