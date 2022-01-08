import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import {
  Worker, Image, Project, RejectedAnnotation, Report,
} from '.';
import { Buffered, BufferefCached } from './PouchWrapper';

PouchDB.plugin(PouchDBAuthentication);

const baseURL = 'https://watson.visagetechnologies.com/couchdb';

export const AuthDB: PouchDB.Database = new PouchDB(`${baseURL}/_users`, { skip_setup: true, adapter: 'http' });
export const RejectionsDB: PouchDB.Database<RejectedAnnotation> = new PouchDB<RejectedAnnotation>(`${baseURL}/rejections`);
export const WorkersDB: PouchDB.Database<Worker> = new PouchDB<Worker>(`${baseURL}/workers`);

const nonWrappedProjectsDB: PouchDB.Database<Project> = new PouchDB<Project>(`${baseURL}/projects`);
export const ProjectsDB = new BufferefCached(nonWrappedProjectsDB);

export const nonWrappedImagesDB: PouchDB.Database<Image> = new PouchDB<Image>(`${baseURL}/images`);
export const ImagesDB = new Buffered(nonWrappedImagesDB);

export const nonWrappedReportsDB: PouchDB.Database<Report> = new PouchDB<Report>(`${baseURL}/reports`);
export const ReportsDB = new Buffered(nonWrappedReportsDB);
