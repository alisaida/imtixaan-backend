import mongoose from 'mongoose';
import Option from './options.js';

const questionSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    question_so: {
        type: String,
    },
    options: [Option.schema],
    correctOptionId: {
        type: String,
        required: true,
    },
    imageUri: {
        type: String,
    },
    soundUri: {
        type: String,
    },
    soundUri_so: {
        type: String,
    },
    isValue: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }

});

const Question = mongoose.model('Question', questionSchema);
export default Question;
