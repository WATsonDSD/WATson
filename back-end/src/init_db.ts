import PouchDB from "pouchdb";
import { Users, Projects, Images } from "./data/dummyData.js";
import { usersDB, projectsDB, imagesDB } from "./databases.js";

// Populate the usersDB database.
for ( const user of Object.values(Users)) {
    await usersDB.put({...user, _id: user.id});
}

// Populate the projectsDB database.
for ( const project of Object.values(Projects)) {
    await projectsDB.put({...project, _id: project.id});
}

// Populate the imagesDB database.
for ( const image of Object.values(Images)) {
    await imagesDB.put({...image, _id: image.id});
}