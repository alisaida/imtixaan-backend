import express from 'express';
import { home, getRandomQuestions, getQuestionById } from '../controllers/questions.js';

const questionsRoute = express.Router();
questionsRoute.get('/', home);

questionsRoute.get('/api/questions', getRandomQuestions);
questionsRoute.get('/api/questions/:id', getQuestionById);

export default questionsRoute;
