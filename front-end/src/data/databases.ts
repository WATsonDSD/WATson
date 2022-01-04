import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import {
  Image, Project, RejectedAnnotation, Report,
} from '.';
import { Buffered, BufferefCached } from './PouchWrapper';

PouchDB.plugin(PouchDBAuthentication);

const baseURL = 'https://watson.visagetechnologies.com/couchdb';
const syncOptions = {
  live: true,
  retry: true,
};

export const AuthDB: PouchDB.Database = new PouchDB(`${baseURL}/_users`, { skip_setup: true, adapter: 'http' });
export const RejectionsDB: PouchDB.Database<RejectedAnnotation> = new PouchDB<RejectedAnnotation>(`${baseURL}/rejections`);

const remoteProjectDB: PouchDB.Database<Project> = new PouchDB<Project>(`${baseURL}/projects`);
const nonWrappedProjectsDB: PouchDB.Database<Project> = new PouchDB<Project>('projects');
nonWrappedProjectsDB.sync(remoteProjectDB, syncOptions).on('change', (change) => {
  console.log('replicating change: ', change);
}).on('paused', (info) => {
  console.log('paused replication: ', info);
}).on('error', (err) => {
  console.log('error on replicaiton:', err);
});
export const ProjectsDB = new BufferefCached(nonWrappedProjectsDB);

export const nonWrappedImagesDB: PouchDB.Database<Image> = new PouchDB<Image>(`${baseURL}/images`);
export const ImagesDB = new Buffered(nonWrappedImagesDB);

export const nonWrappedReportsDB: PouchDB.Database<Report> = new PouchDB<Report>(`${baseURL}/reports`);
export const ReportsDB = new Buffered(nonWrappedReportsDB);
