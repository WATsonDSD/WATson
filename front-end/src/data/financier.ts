import {
  findProjectById, findUserById, getAllUsers, getProjectsOfUser,
} from '.';
import { Role } from './types';

/**
 * GENERATE REPORT - DOWNLOAD must call this one
* for each user get the list of projects
* for each project of each user get the number of images annotated/verified ,
* the hourly rate and the price per image, calculate the hours: x.lenght(toAnnotate), x.costForHourAnnotation
* get the client x.client
 */

/**
 * 
 * 
 * @returns this function return a Csv data array with all the fields needed to show up the report
 * 
 */
export async function generateReport(): Promise<any> {
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
  const CSVdata: { username: string; project: string; client: { client: string; } | { client: string; }; role: Role; images: { numberOfImagesAnnotated: number; } | { numberOfImagesAnnotated: number; }; hours: { hoursA: number; } | { hoursV: number; }; }[] = [];
  const listOfUsers = await getAllUsers(); // first column. all of user
  listOfUsers.forEach(async (user) => {
    const projectsForUser = await getProjectsOfUser(user.id);
    let numberOfImagesAnnotated = 0;
    let numberOfImagesVerified = 0;
    projectsForUser.forEach((project) => {
      const { client } = project;
      numberOfImagesAnnotated = user.projects[project.id].annotated.length;
      numberOfImagesVerified = user.projects[project.id].verified.length;
      const hoursA = (numberOfImagesAnnotated * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
      const hoursV = (numberOfImagesAnnotated * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
      // let numberOfImagesAnnotated = 0;
      // let numberOfImagesVerified = 0;
      // project.images.done.forEach((image) => {
      //   if (image.annotator === user.id) {
      //     numberOfImagesAnnotated += 1;
      //   } else if (image.verifier === user.id) {
      //     numberOfImagesVerified += 1;
      //   }

      if (numberOfImagesAnnotated > 0) {
        CSVdata.push({
          username: user.name, project: project.name, client: { client }, role: user.role, images: { numberOfImagesAnnotated }, hours: { hoursA },
        });
      }
      if (numberOfImagesVerified > 0) {
        CSVdata.push({
          username: user.name, project: project.name, client: { client }, role: user.role, images: { numberOfImagesAnnotated }, hours: { hoursV },
        });
      }
    });
  });
  // user1: project 1 Annotating hoursOfWorkA paymentA client 
  // user1: project 1 Verifing hoursOfWorkV payment client
  return CSVdata;
}

/** total amount of money spent on a project, 
 * total amount of money spent for annotating a project,
 * total amount of money spent for verifing a project
 */
export async function calculateTotalCost(projectID: string): Promise<[number, number, number]> {
  const project = await findProjectById(projectID);
  const totalImagesInDone = project.images.done.length;
  const totalAnnotatedCost = (totalImagesInDone * project.pricePerImageAnnotation);
  const totalVerifiedCost = (totalImagesInDone * project.pricePerImageVerification);
  const totalCost = totalVerifiedCost + totalAnnotatedCost;
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
/**
 * 
 * @param projectId project id
 * @returns number of workers involved in a project 
 */
export async function totalWorkers(projectId: string): Promise<number> {
  const project = await findProjectById(projectId);
  return project.users.length;
}

/**
 * Function that return two parameters, one per the total amount of money earned annotating, one for verificating 
 * @param projectId Project we want to calculate the earnings of
 * @param userId of the user we want to calculate the earnings of
 * @returns total earnings of the user per [annotation, verification]
 */
export async function earningsPerUserPerProject(projectId: string, userId: string): Promise<[ number, number ]> {
  const project = await findProjectById(projectId);
  const user = await findUserById(userId);
  const numTotalAnnotatated = user.projects[projectId].annotated.length;
  const numTotalVerificated = user.projects[projectId].verified.length;
  return [(numTotalAnnotatated) * project.pricePerImageAnnotation, (numTotalVerificated) * project.pricePerImageVerification];
}
/** 
* PROJECT
* spending?? DATE
* name-role-annotated images -verified images -hours of work -efficiency -earnings 
*/
export default generateReport;
