import PouchDB from 'pouchdb';
import { Image, Project, User } from '.';

const username = 'admin';
const password = 'admin';
const address = '127.0.0.1:5984';
const baseURL = `http://${username}:${password}@${address}`;

export const usersDB = new PouchDB<User>(`${baseURL}/users`);
export const projectsDB = new PouchDB<Project>(`${baseURL}/projects`);
export const imagesDB = new PouchDB<Image>(`${baseURL}/images`);
