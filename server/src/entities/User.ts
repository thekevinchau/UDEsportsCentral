import {Schema, model} from 'mongoose';

/*

Below is the MongoDB schema for a particular User. We first create an interface so that we introduce static typing into the schema, ensuring no errors.

Mongoose has a Schema object that outlines how the information will be stored in the database. Think of it as a table in a relational database.

Then we can generate a model that is reusable in other components that save to the database (in this case line 33, const User).

Examples can be found in the documentation for mongoose here: https://mongoosejs.com/docs/typescript.html

*/
interface IUser {
    username: string,
    password: string,
    team_name: string,
    admin: boolean
}


const UserSchema = new Schema<IUser>({
    username: { type: String, required: true},
    password: { type: String, required: true},
    team_name: { type: String},
    admin: { type: Boolean, required: true}
})

const User = model('User', UserSchema);

export default User;