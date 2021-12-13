import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import { Image, Project, RejectedAnnotation } from '.';
import PouchWrapper from './PouchWrapper';

PouchDB.plugin(PouchDBAuthentication);

const baseURL = 'https://df6e815f-936a-4c7f-8c66-12c9e8cb2460-bluemix.cloudantnosqldb.appdomain.cloud';

export const AuthDB: PouchDB.Database = new PouchDB(`${baseURL}/_users`, { skip_setup: true, adapter: 'http' });
export const ImagesDB: PouchDB.Database<Image> = new PouchDB<Image>(`${baseURL}/images`);
const projectsDB: PouchDB.Database<Project> = new PouchDB<Project>(`${baseURL}/projects`);
export const rejectionsDB: PouchDB.Database<RejectedAnnotation> = new PouchDB<RejectedAnnotation>(`${baseURL}/rejections`);

export const ProjectsDB = new PouchWrapper(projectsDB);
