
import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
