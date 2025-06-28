import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

// Configure environment variables
dotenv.config();
const DB_URI = String(process.env.DB_URI) as string;

if (!DB_URI) {
    throw new Error('DB_URI is not defined in the environment variables.');
}

const initializeDB = async (): Promise<void> => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Successfully connected to the database!');
    } catch (err) {
        console.error('Error connecting to the MongoDB database!', err);
        process.exit(1); // Exit the process with an error code
    }
};

initializeDB();

export default initializeDB;
