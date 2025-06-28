import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import apiRouter from './routes/apiRouter';
import initializeDB from './config/dbConfig';
import cors from 'cors';
dotenv.config();

const app: express.Application = express();
const PORT: number = Number(process.env.PORT);

initializeDB();

const corsOptions = {
  origin: 'http://localhost:4200',

}

app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});