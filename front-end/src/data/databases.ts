import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import { Image, Project, RejectedAnnotation } from '.';
import { Buffered, BufferefCached } from './PouchWrapper';

PouchDB.plugin(PouchDBAuthentication);

const baseURL = 'https://df6e815f-936a-4c7f-8c66-12c9e8cb2460-bluemix.cloudantnosqldb.appdomain.cloud';

export const AuthDB: PouchDB.Database = new PouchDB(`${baseURL}/_users`, { skip_setup: true, adapter: 'http' });
export const RejectionsDB: PouchDB.Database<RejectedAnnotation> = new PouchDB<RejectedAnnotation>(`${baseURL}/rejections`);

export const nonWrappedProjectsDB: PouchDB.Database<Project> = new PouchDB<Project>(`${baseURL}/projects`);
export const ProjectsDB = new BufferefCached(nonWrappedProjectsDB);

export const nonWrappedImagesDB: PouchDB.Database<Image> = new PouchDB<Image>(`${baseURL}/images`);
export const ImagesDB = new Buffered(nonWrappedImagesDB);
