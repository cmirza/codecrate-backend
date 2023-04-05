import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users';
import snippetsRoutes from './routes/snippets';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/snippets', snippetsRoutes);

export default app;
