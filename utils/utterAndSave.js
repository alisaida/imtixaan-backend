import fs from 'fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Function to simulate an asynchronous call to Azure Speech API with a delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const utterAndSaveAudio = async (text, voiceName, subscriptionKey, region) => {
    const tokenEndpoint = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;
    const ttsEndpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${voiceName.language}'><voice name='${voiceName.voice}'>${text}</voice></speak>`;

    // Get the authorization token
    const authTokenResponse = await axios.post(tokenEndpoint, null, {
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Content-type': 'application/x-www-form-urlencoded',
        },
    });

    const authToken = authTokenResponse.data;

    // Perform text-to-speech
    const ttsResponse = await axios.post(
        ttsEndpoint,
        ssml,
        {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-16khz-64kbitrate-mono-mp3',
            },
            responseType: 'arraybuffer',
        }
    );

    await sleep(15000);

    return Buffer.from(ttsResponse.data);
};

const utterAndSave = async (questionsData) => {
    dotenv.config({ path: 'dev.env' });

    const batchSize = 10;
    const delayBetweenBatches = 30000; // 30 seconds in milliseconds

    const totalBatches = Math.ceil(questionsData.length / batchSize);

    const subscriptionKey = process.env.AZURE_SPEECH_SERVICE_KEY;
    const region = process.env.AZURE_REGION;

    const voices = {
        'en-US': {
            voiceNastasha: { language: 'en-US', voice: process.env.AZURE_VOICE_NATASHA },
            voiceWilliam: { language: 'en-US', voice: process.env.AZURE_VOICE_WILLIAM },
        },
        'so-SO': {
            voiceUbax: { language: 'so-SO', voice: process.env.AZURE_VOICE_UBAX },
            voiceMuse: { language: 'so-SO', voice: process.env.AZURE_VOICE_MUSE },
        },
    };

    const languageConfig = {
        question: 'en-US',
        question_so_accent: 'so-SO',
        optionText: 'en-US',
        optionText_so_accent: 'so-SO',
    };

    // Process questions in batches
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startIndex = batchIndex * batchSize;
        const endIndex = startIndex + batchSize;
        const batchQuestions = questionsData.slice(startIndex, endIndex);

        const utteredData = await Promise.all(
            batchQuestions.map(async (original, index) => {
                const utteredQuestion = {
                    ...original,
                    soundUri: null, // Reset the soundUri field
                    soundUri_so: null, // Reset the soundUri_so field
                };

                const languageKeys = Object.keys(languageConfig);

                for (const key of languageKeys) {
                    if (original[key]) {
                        const languageConfigKey = languageConfig[key];
                        const voiceConfig = voices[languageConfigKey];

                        if (!voiceConfig) {
                            console.error(`Voice configuration not found for language: ${languageConfigKey}`);
                            continue;
                        }

                        const voiceEn = index % 2 === 0 ? voiceConfig.voiceNastasha : voiceConfig.voiceWilliam;
                        const voiceSo = index % 2 === 0 ? voiceConfig.voiceUbax : voiceConfig.voiceMuse;

                        const audioBuffer = await utterAndSaveAudio(original[key], key.includes('_so_accent') ? voiceSo : voiceEn, subscriptionKey, region);
                        const audioFileName = `${uuidv4()}_${key.includes('_so_accent') ? 'so' : 'en'}_question.mp3`;
                        const audioFilePath = `./audio/${audioFileName}`;
                        fs.writeFileSync(audioFilePath, audioBuffer);

                        utteredQuestion[key.includes('_so_accent') ? 'soundUri_so' : 'soundUri'] = audioFilePath;

                    }
                }

                if (original.options && original.options.length > 0) {
                    utteredQuestion.options = await Promise.all(
                        original.options.map(async (option) => {
                            const utteredOption = {
                                ...option,
                                soundUri: null, // Reset the soundUri field
                                soundUri_so: null, // Reset the soundUri_so field
                            };

                            const optionLanguageKeys = Object.keys(languageConfig);

                            for (const key of optionLanguageKeys) {
                                if (option[key]) {
                                    const languageConfigKey = languageConfig[key];
                                    const voiceConfig = voices[languageConfigKey];

                                    if (!voiceConfig) {
                                        console.error(`Voice configuration not found for language: ${languageConfigKey}`);
                                        continue;
                                    }

                                    const voiceEnOption = index % 2 === 0 ? voiceConfig.voiceNastasha : voiceConfig.voiceWilliam;
                                    const voiceSoOption = index % 2 === 0 ? voiceConfig.voiceUbax : voiceConfig.voiceMuse;

                                    const audioBufferOption = await utterAndSaveAudio(option[key], key.includes('_so_accent') ? voiceSoOption : voiceEnOption, subscriptionKey, region);
                                    const audioFileNameOption = `${uuidv4()}_${key.includes('_so_accent') ? 'so' : 'en'}_option.mp3`;
                                    const audioFilePathOption = `./audio/${audioFileNameOption}`;
                                    fs.writeFileSync(audioFilePathOption, audioBufferOption);

                                    utteredOption[key.includes('_so_accent') ? 'soundUri_so' : 'soundUri'] = audioFilePathOption;

                                }
                            }

                            return utteredOption;
                        })
                    );
                }

                return utteredQuestion;
            })
        );

        // Filter out any null values from failed translations
        const validUtteredData = utteredData.filter(Boolean);

        // Save the uttered data to a JSON file
        const utteredFilePath = `./data/utteredQuestions_batch${batchIndex + 1}.json`;
        fs.writeFileSync(utteredFilePath, JSON.stringify(validUtteredData, null, 2));

        console.log(`Uttered data for batch ${batchIndex + 1} saved to: ${utteredFilePath}`);

        if (batchIndex < totalBatches - 1) {
            // Wait for the specified delay between batches
            console.log(`Waiting for ${delayBetweenBatches / 1000} seconds before processing the next batch...`);
            await sleep(delayBetweenBatches);
        }
    }

    console.log(`All batches processed successfully.`);
    return questionsData; // Return the original questionsData or any relevant result
};

export default utterAndSave;
