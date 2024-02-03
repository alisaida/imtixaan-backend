import express from 'express';
import { home, getRandomQuestions, getQuestionIdsForQuiz, getQuestionById } from '../controllers/questions.js';
import { limiter } from '../utils/rateLimitter.js';

const questionsRoute = express.Router();
// questionsRoute.get('/', home);

questionsRoute.get('/api/questionsV2', limiter, getRandomQuestions);
questionsRoute.get('/api/questions', limiter, getQuestionIdsForQuiz);
questionsRoute.get('/api/questions/:id', limiter, getQuestionById);

export default questionsRoute;
