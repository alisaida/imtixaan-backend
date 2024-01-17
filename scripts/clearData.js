// clearQuestions.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Question from '../models/questions.js'; // Adjust the import path based on your actual model location

dotenv.config({ path: 'dev.env' });

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URI = process.env.DB_URI;

const dbConnectionUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URI}/${DB_NAME}?retryWrites=true&w=majority`;

const clearQuestions = async () => {
    try {
        // Connect to the database
        await mongoose.connect(dbConnectionUrl, {});

        // Clear all documents in the 'questions' collection
        const result = await Question.deleteMany({});

        console.log(`Deleted ${result.deletedCount} questions`);

        // Close the connection
        mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error clearing questions:', error);
    }
};

// Run the script
clearQuestions();
