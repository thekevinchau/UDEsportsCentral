import * as mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

/*

We will be using a library called Mongoose to assist in accessing and querying the database. The implementation is primarily straight forward.

Documentation for mongoose can be found here: https://mongoosejs.com/docs/typescript.html

Initialize DB is an asynchronous function that connects to the database using the environment variable DB_URI, which can be found inside the Google Drive.

It is then called in app.ts when the server initializes.
*/

const DB_URI = String(process.env.DB_URI);

const initializeDB = async() => {
    try{
        await mongoose.connect(DB_URI);
        console.log('Successfully connected to the database!')
    }catch(err){
        console.error('Error connecting to the MongoDB database!', err)
    }
}

export default initializeDB;