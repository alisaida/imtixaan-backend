import express from 'express';
import mongoose from 'mongoose';
import Question from '../models/questions.js';

export const home = async (req, res, next) => {
    res.send('Welcome!');
};

export const getRandomQuestions = async (req, res, next) => {
    const topics = ['australia_its_people', 'democratic_beliefs', 'government_and_law', 'values'];

    try {
        // Fetch 5 random questions for each topic
        const randomQuestions = await Promise.all(
            topics.map(async (topic) => {
                const topicQuestions = await Question.aggregate([
                    { $match: { topic: topic } },
                    { $sample: { size: 5 } },
                ]);
                return topicQuestions;
            })
        );
        const flattenedQuestions = randomQuestions.flat();
        res.status(200).json(flattenedQuestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const getQuestionById = async (req, res, next) => {
    const questionId = req.params.id;

    try {
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getQuestionIdsForQuiz = async (req, res, next) => {
    const topics = ['australia_its_people', 'democratic_beliefs', 'government_and_law', 'values'];

    try {
        // Fetch 5 random questions for each topic
        const randomQuestions = await Promise.all(
            topics.map(async (topic) => {
                const topicQuestions = await Question.aggregate([
                    { $match: { topic: topic } },
                    { $sample: { size: 5 } },
                    { $project: { _id: 1 } }, // Only include the _id field
                ]);
                return topicQuestions;
            })
        );
        const flattenedQuestionIds = randomQuestions.flat().map(question => question._id);
        res.status(200).json(flattenedQuestionIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



