import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import { Image, Project, User } from '.';

PouchDB.plugin(PouchDBAuthentication);

const baseURL = 'https://df6e815f-936a-4c7f-8c66-12c9e8cb2460-bluemix.cloudantnosqldb.appdomain.cloud';

export const AuthDB = new PouchDB(`${baseURL}/_users`, { skip_setup: true, adapter: 'http' });
export const usersDB = new PouchDB<User>(`${baseURL}/users`); // ! we won't need this db shortly
export const ImagesDB = new PouchDB<Image>(`${baseURL}/images`);
export const ProjectsDB = new PouchDB<Project>(`${baseURL}/projects`);
