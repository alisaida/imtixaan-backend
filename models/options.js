import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
    optionId: {
        type: String,
        required: true,
    },
    optionText: {
        type: String,
        required: true,
    },
    optionText_so: {
        type: String,
        required: true,
    },
    soundUri: {
        type: String,
    },
    soundUri_so: {
        type: String,
    }
});

const Option = mongoose.model('Option', optionSchema);

export default Option;
