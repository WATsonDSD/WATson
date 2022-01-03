import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import {
  Rejection,
  Project,
  Report,
  Image,
} from '.';

PouchDB.plugin(PouchDBAuthentication);

const baseURL = 'https://watson.visagetechnologies.com/couchdb';

export const AuthDB: PouchDB.Database = new PouchDB(`${baseURL}/_users`, { skip_setup: true, adapter: 'http' });

export const ImagesDB: PouchDB.Database<Image> = new PouchDB<Image>(`${baseURL}/images`);
export const ReportsDB: PouchDB.Database<Report> = new PouchDB<Report>(`${baseURL}/reports`);
export const ProjectsDB: PouchDB.Database<Project> = new PouchDB<Project>(`${baseURL}/projects`);
export const RejectionsDB: PouchDB.Database<Rejection> = new PouchDB<Rejection>(`${baseURL}/rejections`);
