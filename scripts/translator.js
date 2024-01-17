import translateAndTransform from '../utils/translateAndTransform.js';
import data from '../resources/sanitized_data.js';

// Use the utility function to transform and translate the data
translateAndTransform(data)
    .then((transformedData) => {
        // console.log(transformedData[0]);
    })
    .catch((error) => {
        // console.error('Translation and transformation error:', error);
    });
