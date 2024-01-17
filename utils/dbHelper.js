// utils/dbHelper.js
import mongoose from 'mongoose';

const connectToDatabase = async (dbConnectionUrl) => {
    try {
        await mongoose.connect(dbConnectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

const insertRecords = async (model, data) => {
    try {
        const result = [];

        for (const item of data) {
            try {
                const document = new model(item);
                const savedDocument = await document.save();
                result.push(savedDocument);
            } catch (error) {
                console.error('Error inserting document:', error);

                if (error.name === 'ValidationError') {
                    // Log validation errors for better identification
                    console.error('Validation errors:', item);
                    // console.error('Validation errors:', error.errors);
                }
            }
        }

        console.log('Data inserted successfully:');
        return result;
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
};


export { connectToDatabase, insertRecords };
