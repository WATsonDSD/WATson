// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CSVLink, CSVDownload } from 'react-csv';

import {
  findProjectById, findUserById, getAllUsers, getProjectsOfUser,
} from '.';

/**
 * GENERATE REPORT - DOWNLOAD must call this one
* for each user get the list of projects
* for each project of each user get the number of images annotated/verified ,
* the hourly rate and the price per image, calculate the hours: x.lenght(toAnnotate), x.costForHourAnnotation
* get the client x.client
 */

export async function generateReport() {
  // this will be added in the page that generates the reports 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const headers = [
    { label: 'Name', key: 'username' },
    { label: 'Project', key: 'project' },
    { label: 'Client', key: 'client' },
    { label: 'Role', key: 'role' },
    { label: 'images', key: 'images' },
    { label: 'hoursOfWork', key: 'hours' },
  ];
  const CSVdata = [];
  const listOfUsers = await getAllUsers(); // first column. all of user
  listOfUsers.forEach(async (user) => {
    const projectsForUser = await getProjectsOfUser(user.id);
    projectsForUser.forEach((project) => {
      const { client } = project;
      const hoursA = 0;
      const hoursV = 0;
      const numberOfImages = user.projects[project.id].done.length;
      // let numberOfImagesAnnotated = 0;
      // let numberOfImagesVerified = 0;
      // project.images.done.forEach((image) => {
      //   if (image.annotator === user.id) {
      //     numberOfImagesAnnotated += 1;
      //   } else if (image.verifier === user.id) {
      //     numberOfImagesVerified += 1;
      //   }
      //   hoursA = (numberOfImagesAnnotated * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
      //   hoursV = (numberOfImagesAnnotated * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;

      if (user.projects[project.id].toAnnotate) {
        CSVdata.push({
          username: user.name, project: project.name, client: { client }, role: user.role, images: { numberOfImages }, hours: { hoursA },
        });
      }
      if (user.projects[project.id].toVerify) {
        CSVdata.push({
          username: user.name, project: project.name, client: { client }, role: user.role, images: { numberOfImages }, hours: { hoursV },
        });
      }
    });
  });
  // user1: project 1 Annotating hoursOfWorkA paymentA client 
  // user1: project 1 Verifing hoursOfWorkV payment client
}

/** total amount of money spent on a project, 
 * total amount of money spent for annotating a project,
 * total amount of money spent for verifing a project
 */
export async function calculateTotalCost(projectID: string): Promise<[number, number, number]> {
  const project = await findProjectById(projectID);
  const totalImagesInDone = project.images.done.length;
  const totalAnnotated = project.images.toVerify.length + totalImagesInDone;
  const totalCost = (totalAnnotated * project.pricePerImageAnnotation + totalImagesInDone * project.pricePerImageVerification);
  const totalAnnotatedCost = (totalAnnotated * project.pricePerImageAnnotation);
  const totalVerifiedCost = (totalImagesInDone * project.pricePerImageVerification);
  return [totalCost, totalAnnotatedCost, totalVerifiedCost];
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function totalHoursOfWork(projectID: string): Promise<[number, number, number]> {
  const project = await findProjectById(projectID);
  const numberOfImages = project.images.done.length;
  const hoursAnnotation = ((numberOfImages) * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
  const hoursVerification = (numberOfImages * project.pricePerImageVerification) / project.hourlyRateVerification;
  return [hoursAnnotation + hoursVerification, hoursAnnotation, hoursVerification];
}

/**
 * Total annotations made
 */

export async function totalAnnotationMade(projectId: string): Promise<number> {
  const project = await findProjectById(projectId);
  return project.images.done.length;
}

export async function totalWorkers(projectId: string): Promise<number> {
  const project = await findProjectById(projectId);
  return project.users.length;
}

export async function earningsPerUserPerProject(projectId: string, userId: string): Promise<number> {
  const project = await findProjectById(projectId);
  const user = await findUserById(userId);
  const numTotal = user.projects[projectId].done.length;
  return ((numTotal) * project.pricePerImageAnnotation + (numTotal) * project.pricePerImageVerification);
}
/** 
* PROJECT
* spending?? DATE
* name-role-annotated images -verified images -hours of work -efficiency -earnings 
*/
export default generateReport;
