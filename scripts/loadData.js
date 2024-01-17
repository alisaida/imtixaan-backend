// bulkInsert.js
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Add this line
import { connectToDatabase, insertRecords } from '../utils/dbHelper.js';
import Question from '../models/questions.js';
import data from '../resources/data_final.js'; //data file being loaded

dotenv.config({ path: 'dev.env' });

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URI = process.env.DB_URI;

const dbConnectionUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URI}/${DB_NAME}?retryWrites=true&w=majority`;

const loadQuestions = async () => {
    try {
        await mongoose.connect(dbConnectionUrl, {});

        // Insert data into MongoDB
        await insertRecords(Question, data);

        // Close the connection after insertion
        mongoose.connection.close();
        console.log('Connection closed after insertion');

    } catch (error) {
        console.error('Error clearing questions:', error);
    }
};

loadQuestions();