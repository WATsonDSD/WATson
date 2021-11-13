import * as PouchDB from 'pouchdb';
import { Users } from './dummyData';
import { User } from './types';

//  The following line creates a local db for users.
var usersDB = new PouchDB('localhost:5984/users');

// start by uploading users.
for (const user of Object.values(Users)) {
    // upload the user
   usersDB.put({...user, _id: user.id});
}

Object.keys(Users).forEach( (userId) =>  usersDB.get(userId)
    .then(val => console.log(JSON.stringify(val))));
