import PouchDB from 'pouchdb';
import { Image, Project, User } from '.';

const username = 'admin';
const password = 'admin';
const address = '127.0.0.1:5984';
const baseURL = `http://${username}:${password}@${address}`;

export const AuthDB = new PouchDB('https://apikey-v2-1c2upctjxha6frgm8g6ieixn0bwva5nwt9gljikzltuy:7c4568f539e86723df39e8ef65c6cf78@df6e815f-936a-4c7f-8c66-12c9e8cb2460-bluemix.cloudantnosqldb.appdomain.cloud/_users', { skip_setup: true });

export const usersDB = new PouchDB<User>(`${baseURL}/users`);
export const projectsDB = new PouchDB<Project>(`${baseURL}/projects`);
export const imagesDB = new PouchDB<Image>(`${baseURL}/images`);

// I need to generate these keys & passwords programmatically
// const username = 'apikey-c8a7e6326de740c2b01744620ca194bc';
// const password = '11265157da31d17e378aa8cbc32070334652cf6a';
// const address = 'https://df6e815f-936a-4c7f-8c66-12c9e8cb2460-bluemix.cloudantnosqldb.appdomain.cloud';
// const baseURL = `http://${username}:${password}@${address}`;

// export default new PouchDB(`${baseURL}`);
