import utterAndSave from '../utils/utterAndSave.js';
import data from '../tmp/dummy.js';


const textToSpeech = async () => {

    try {
        // Call the utter function with your sample data
        const utteredData = await utterAndSave(data);

        // Log the result or perform any additional actions
        // console.log('Utterance completed:', utteredData);
    } catch (error) {
        console.error('Error in text-to-speech:', error);
    }
};

// Call the textToSpeech function
textToSpeech();
