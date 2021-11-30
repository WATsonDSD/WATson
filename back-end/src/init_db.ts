import { Users, Projects, Images } from "./data/dummyData.js";
import { usersDB, projectsDB, imagesDB } from "./databases.js";
import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

// // Populate the usersDB database.
// for ( const user of Object.values(Users)) {
//     await usersDB.put({...user, _id: user.id});
// }

// // Populate the projectsDB database.
// for ( const project of Object.values(Projects)) {
//     await projectsDB.put({...project, _id: project.id});
// }

// // Populate the imagesDB database.
// for ( const image of Object.values(Images)) {
//     await imagesDB.put({...image, _id: image.id});
// }



PouchDB.plugin(PouchDBAuthentication);

const db = new PouchDB('http://admin:admin@localhost:5984/db', { skip_setup: true });

db.signUp("admin@watson.com", "admin", {
    roles: ["projectManager", "adminId"],
  }, (err, response) => {
    if (err) {
      throw Error(err.name);
    }
    if (response) {
      console.log('signed up admin');
    }
  }
);

usersDB.put({
    "_id": "adminId",
    "id": "adminId",
    "name": "Project Manager",
    "email": "admin@dummy.com",
    "role": "projectManager",
    "projects": {
    }
});