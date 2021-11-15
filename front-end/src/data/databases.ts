import PouchDB from 'pouchdb';
import { Image, Project, User } from '.';

export const usersDB = new PouchDB<User>('http://admin:admin@127.0.0.1:5984/users');
export const projectsDB = new PouchDB<Project>('http://admin:admin@127.0.0.1:5984/projects');
export const imagesDB = new PouchDB<Image>('http://admin:admin@127.0.0.1:5984/images');
