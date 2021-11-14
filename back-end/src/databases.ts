import PouchDB from "pouchdb";

export const usersDB = new PouchDB('http://admin:admin@127.0.0.1:5984/users');
export const projectsDB = new PouchDB('http://admin:admin@127.0.0.1:5984/projects');
export const imagesDB = new PouchDB('http://admin:admin@127.0.0.1:5984/images');