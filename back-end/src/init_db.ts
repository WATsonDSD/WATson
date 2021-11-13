import PouchDB from "pouchdb";
import { Users } from "./data/dummyData.js";

// connect to the user database
const userDB = new PouchDB('http://girlfriend:admini@127.0.0.1:5984/fruits');

// put the users in the database.
for ( const user of Object.values(Users)) {
    await userDB.put({...user, _id: user.id});
}