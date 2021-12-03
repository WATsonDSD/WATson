import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';
import { Image, Project, User } from '.';

const username = 'admin';
const password = 'admin';
const address = '127.0.0.1:5984';
const baseURL = `http://${username}:${password}@${address}`;

export const usersDB = new PouchDB<User>(`${baseURL}/users`);
export const projectsDB = new PouchDB<Project>(`${baseURL}/projects`);
export const imagesDB = new PouchDB<Image>(`${baseURL}/images`);

/**
 * Because of a design flaw in pouchdb-authentication, we need to attach
 * our db instance to a dummy database - in this case "/db".
 * (https://stackoverflow.com/questions/30028575/pouchdb-authentication-create-new-couchdb-users)
 */
PouchDB.plugin(PouchDBAuthentication);
export const authDB = new PouchDB('http://localhost:5984/db', { skip_setup: true });
// export default new PouchDB(`${baseURL}`);

// I need to generate these keys & passwords programmatically
// const username = 'apikey-c8a7e6326de740c2b01744620ca194bc';
// const password = '11265157da31d17e378aa8cbc32070334652cf6a';
// const address = 'https://df6e815f-936a-4c7f-8c66-12c9e8cb2460-bluemix.cloudantnosqldb.appdomain.cloud';
// const baseURL = `http://${username}:${password}@${address}`;
