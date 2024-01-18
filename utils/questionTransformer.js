import fs from 'fs';

const transformQuestions = (questionsData) => {
    let optionIdCounter = 4001;

    const transformedData = questionsData.map((original, index) => {
        const questionId = 8001 + index;
        const correctOptionId = optionIdCounter + original.options.indexOf(original.correct_option);

        const transformedQuestion = {
            questionId,
            question: original.question,
            topic: original.topic,
            question_so: null,
            question_so_accent: null,
            imageUri: null,
            soundUri: null,
            soundUri_so: null,
            isValue: false,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            options: original.options.map((option) => {
                const currentOptionId = optionIdCounter;
                optionIdCounter += 1;  // Increment the counter for the next option
                return {
                    optionId: currentOptionId,
                    optionText: option,
                    optionText_so: null,
                    optionText_so_accent: null,
                    soundUri: null,
                    soundUri_so: null,
                };
            }),
            correctOptionId,
        };

        return transformedQuestion;
    });

    // Save the transformed data to a JSON file
    const filePath = './tmp/transformedQuestions.json';
    fs.writeFileSync(filePath, JSON.stringify(transformedData, null, 2));

    console.log(`Transformed data saved to: ${filePath}`);

    return transformedData;
};

export default transformQuestions;
