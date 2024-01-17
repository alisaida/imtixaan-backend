import fs from 'fs';
import path from 'path';

// List of file paths
const filePaths = [
    path.join('data', '../data/utteredQuestions_batch1.json'),
    path.join('data', '../data/utteredQuestions_batch2.json'),
    path.join('data', '../data/utteredQuestions_batch3.json'),
    path.join('data', '../data/utteredQuestions_batch4.json'),
    path.join('data', '../data/utteredQuestions_batch5.json'),
    path.join('data', '../data/utteredQuestions_batch6.json'),
    path.join('data', '../data/utteredQuestions_batch7.json'),
    path.join('data', '../data/utteredQuestions_batch8.json'),
    path.join('data', '../data/utteredQuestions_batch9.json'),
    path.join('data', '../data/utteredQuestions_batch10.json'),
];

let totalQuestions = 0;
let totalSoundUri = 0;
let totalSoundUri_so = 0

// Loop through each file path
filePaths.forEach(filePath => {
    // Read the data from the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Loop through data array of questions
    data.forEach(question => {
        // Increment total questions count
        totalQuestions++;

        // Check if soundUri property is not null or undefined for the main question
        if (question.soundUri === null) {
            totalSoundUri++;
        }

        if (question.soundUri_so === null) {
            totalSoundUri_so++;
        }

        // Check if soundUri property is not null or undefined for each option
        if (question.options && question.options.length > 0) {
            question.options.forEach(option => {
                if (option.soundUri === null) {
                    totalSoundUri++;
                }
                if (option.soundUri_so === null) {
                    totalSoundUri_so++;
                }
            });
        }
    });
});

// Log the total number of questions and soundUri properties
console.log(`Total number of questions: ${totalQuestions}`);
console.log(`Total number of soundUri properties: ${totalSoundUri}`);
console.log(`Total number of soundUri_so properties: ${totalSoundUri_so}`);
