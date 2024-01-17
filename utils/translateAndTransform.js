// translateAndTransform.js
import fs from 'fs';
import axios from 'axios';
import { uuid } from 'uuidv4';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const translateAndTransform = async (questionsData) => {
    const key = '2629ce678dc1480bba7d2617c1dd1584'; // Replace with your actual key
    const endpoint = 'https://api.cognitive.microsofttranslator.com';
    const location = 'eastus'; // Replace with your actual location

    const params = new URLSearchParams();
    params.append('api-version', '3.0');
    params.append('from', 'en');
    params.append('to', 'so'); // Change 'so' to the target language code

    // Save the intermediate translated data to a JSON file
    const intermediateFilePath = './data/translatedQuestionsIntermediate.json';
    fs.writeFileSync(intermediateFilePath, JSON.stringify(questionsData, null, 2));

    console.log(`Intermediate translated data saved to: ${intermediateFilePath}`);

    const transformedData = await Promise.all(
        questionsData.map(async (original, index) => {
            await wait(1000); // One-second wait between requests

            const questionId = 8001 + index;

            const translationData = [{
                text: original.question
            }];

            try {
                const translationResponse = await axios.post(`${endpoint}/translate`, translationData, {
                    headers: {
                        'Ocp-Apim-Subscription-Key': key,
                        'Ocp-Apim-Subscription-Region': location,
                        'Content-type': 'application/json',
                        'X-ClientTraceId': uuid()
                    },
                    params: params,
                    responseType: 'json'
                });

                const translatedText = translationResponse.data[0]?.translations[0]?.text;

                const transformedQuestion = {
                    ...original,
                    questionId,
                    question_so: translatedText,
                    question_so_accent: translatedText,
                    options: original.options.map((option, optionIndex) => {
                        const optionId = option.optionId; // Preserve the original optionId
                        const optionTranslationData = [{
                            text: option.optionText
                        }];

                        return {
                            ...option,
                            optionId,
                        };
                    }),
                    correctOptionId: original.correctOptionId,
                };

                // Translate option texts
                transformedQuestion.options = await Promise.all(transformedQuestion.options.map(async (option) => {
                    const optionTranslationData = [{
                        text: option.optionText
                    }];

                    try {
                        const optionTranslationResponse = await axios.post(`${endpoint}/translate`, optionTranslationData, {
                            headers: {
                                'Ocp-Apim-Subscription-Key': key,
                                'Ocp-Apim-Subscription-Region': location,
                                'Content-type': 'application/json',
                                'X-ClientTraceId': uuid()
                            },
                            params: params,
                            responseType: 'json'
                        });

                        const translatedOptionText = optionTranslationResponse.data[0]?.translations[0]?.text;

                        return {
                            ...option,
                            optionText_so: translatedOptionText || option.optionText,
                            optionText_so_accent: translatedOptionText || option.optionText,
                        };
                    } catch (error) {
                        console.error(`Option translation error for ${option.optionText}:`, error);
                        return {
                            ...option,
                            optionText_so: option.optionText, // Use original option text if translation fails
                        };
                    }
                }));

                return transformedQuestion;
            } catch (error) {
                console.error('Translation error:', error);
                return null;
            }
        })
    );

    // Filter out any null values from failed translations
    const validTransformedData = transformedData.filter(Boolean);

    // Save the transformed data to a JSON file
    const transformedFilePath = './data/translatedQuestions.json';
    fs.writeFileSync(transformedFilePath, JSON.stringify(validTransformedData, null, 2));

    console.log(`Transformed data saved to: ${transformedFilePath}`);

    return validTransformedData;
};

export default translateAndTransform;
