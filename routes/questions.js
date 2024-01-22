import express from 'express';
import { home, getRandomQuestions, getQuestionIdsForQuiz, getQuestionById } from '../controllers/questions.js';

const questionsRoute = express.Router();
questionsRoute.get('/', home);

questionsRoute.get('/api/questionsV2', getRandomQuestions);
questionsRoute.get('/api/questions', getQuestionIdsForQuiz);
questionsRoute.get('/api/questions/:id', getQuestionById);

export default questionsRoute;
