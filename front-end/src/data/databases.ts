import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import {
  Image, Project, RejectedAnnotation, Report,
} from '.';
import { Buffered, Replicated } from './PouchWrapper';

PouchDB.plugin(PouchDBAuthentication);

const baseURL = 'https://watson.visagetechnologies.com/couchdb';

export const AuthDB: PouchDB.Database = new PouchDB(`${baseURL}/_users`, { skip_setup: true, adapter: 'http' });
export const RejectionsDB: PouchDB.Database<RejectedAnnotation> = new PouchDB<RejectedAnnotation>(`${baseURL}/rejections`);

const remoteProjectDB: PouchDB.Database<Project> = new PouchDB<Project>(`${baseURL}/projects`);
export const ProjectsDB = new Replicated(remoteProjectDB);

export const nonWrappedImagesDB: PouchDB.Database<Image> = new PouchDB<Image>(`${baseURL}/images`);
export const ImagesDB = new Buffered(nonWrappedImagesDB);

export const nonWrappedReportsDB: PouchDB.Database<Report> = new PouchDB<Report>(`${baseURL}/reports`);
export const ReportsDB = new Buffered(nonWrappedReportsDB);
