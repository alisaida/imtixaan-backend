import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import createError from 'http-errors';
import morgan from 'morgan';

import questionsRouter from './routes/questions.js';

dotenv.config({ path: 'dev.env' });
const NODE_ENV = process.env.NODE_ENV;
const SERVICE_NAME = process.env.SERVICE_NAME;
const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URI = process.env.DB_URI;

const dbConnectionUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URI}/${DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/', questionsRouter);

app.use(cors({
    // allow requests from react 
    origin: ['http://localhost:3000']
}));

app.use(async (req, res, next) => {
    next(createError.NotFound());
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

mongoose.connect(dbConnectionUrl, {})
    .then(() => app.listen(PORT, () => {
        console.log(`${SERVICE_NAME}.${NODE_ENV} running on http://localhost:${PORT}`);
        console.log(`database connection successful: ${dbConnectionUrl}`);
    }))
    .catch((error) => console.log(`${error} failed to connect to database`));

