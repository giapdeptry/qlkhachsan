const path = require('path');
const Mongoose = require('mongoose');

require('dotenv').config({
    path: path.resolve(__dirname, '../../.env'),
});

const connectDB = async () => {
    try {
        const uri = process.env.CONNECT_DB;
        if (!uri || typeof uri !== 'string') {
            throw new Error('Missing or invalid CONNECT_DB in environment');
        }

        await Mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

module.exports = connectDB;
