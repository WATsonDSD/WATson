import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import {
  Worker, Image, Project, RejectedAnnotation, Report,
} from '.';
import { Replicated } from './PouchWrapper';

PouchDB.plugin(PouchDBAuthentication);

const baseURL = 'https://watson.visagetechnologies.com:6984';

export const AuthDB: PouchDB.Database = new PouchDB(`${baseURL}/_users`, { skip_setup: true, adapter: 'http' });
export const RejectionsDB = new Replicated(new PouchDB<RejectedAnnotation>(`${baseURL}/rejections`));
export const WorkersDB = new Replicated(new PouchDB<Worker>(`${baseURL}/workers`));

export const nonWrappedProjectsDB: PouchDB.Database<Project> = new PouchDB<Project>(`${baseURL}/projects`);
export const ProjectsDB = new Replicated(nonWrappedProjectsDB);

export const nonWrappedImagesDB: PouchDB.Database<Image> = new PouchDB<Image>(`${baseURL}/images`);
export const ImagesDB = new Replicated(nonWrappedImagesDB);

export const nonWrappedReportsDB: PouchDB.Database<Report> = new PouchDB<Report>(`${baseURL}/reports`);
export const ReportsDB = new Replicated(nonWrappedReportsDB);
