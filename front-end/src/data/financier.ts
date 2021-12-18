/* eslint-disable no-unused-expressions */
/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { userInfo } from 'os';
import {
  findProjectById, findUserById, getAllUsers, getProjectsOfUser, UserID,
} from '.';
import { ProjectsIcon } from '../view/components/shared/sidebar/MenuIcons';
import { createReport, insertReportRow } from './report';
import { ProjectID, Role } from './types';

/**
 * @returns this function return a Csv data array with all the fields needed to show up the report * 
 */
export async function generateReport(): Promise<any> {
  const reportId = await createReport();
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
  const listOfUsers = await getAllUsers(); // first column. all of user
  listOfUsers.forEach(async (user) => {
    const projectsForUser = await getProjectsOfUser(user.id);
    let numberOfImagesAnnotated = 0;
    let numberOfImagesVerified = 0;
    projectsForUser.forEach((project) => {
      const { client } = project;
      numberOfImagesAnnotated = user.projects[project.id].annotated.length;
      numberOfImagesVerified = user.projects[project.id].verified.length;
      const paymentA = (numberOfImagesAnnotated * project.pricePerImageAnnotation);
      const paymentV = (numberOfImagesVerified * project.pricePerImageVerification);
      const hoursA = (numberOfImagesAnnotated * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
      const hoursV = (numberOfImagesVerified * project.pricePerImageVerification) / project.hourlyRateVerification;

      if (numberOfImagesAnnotated > 0) {
        insertReportRow(
          reportId, user.id, user.name, user.email, user.role, project.name, hoursA, paymentA, project.client,
        );
      }
      if (numberOfImagesVerified > 0) {
        insertReportRow(
          reportId, user.id, user.name, user.email, user.role, project.name, hoursV, paymentV, project.client,
        );
      }
    });
  });
  // user1: project 1 Annotating hoursOfWorkA paymentA client 
  // user1: project 1 Verifing hoursOfWorkV payment client
  return reportId;
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
export async function paymentPerUserPerProject(projectId: string, userId: string): Promise<[ number, number ]> {
  const project = await findProjectById(projectId);
  const user = await findUserById(userId);
  const numTotalAnnotatated = user.projects[projectId].annotated.length;
  const numTotalVerificated = user.projects[projectId].verified.length;
  return [(numTotalAnnotatated) * project.pricePerImageAnnotation, (numTotalVerificated) * project.pricePerImageVerification];
}
export async function earningsPerUser(userID: UserID) {
  const user = await findUserById(userID);
  let numberAnnotated = 0;
  let numberVerified = 0;
  let totalEarnings = 0;
  Object.entries(user.projects).forEach(
    async ([key, value]) => // id project -> value valye
    // eslint-disable-next-line brace-style
    {
      numberAnnotated = value.annotated.length;
      numberVerified = value.verified.length;
      const project = await findProjectById(key);
      totalEarnings += numberAnnotated * project.pricePerImageAnnotation + numberVerified * project.pricePerImageVerification;
    },
  );
  return totalEarnings;
}

export async function hoursWorkPerProjectPerUser(userID: UserID, projectId: ProjectID) {
  const user = await findUserById(userID);
  const project = await findProjectById(projectId);
  return ((user.projects[projectId].annotated.length * project.pricePerImageAnnotation) / project.hourlyRateAnnotation)
 + ((user.projects[projectId].verified.length * project.pricePerImageVerification) / project.hourlyRateVerification);
}

export async function earningsInTotalPerProjectPerUser(userID: UserID, projectId: ProjectID) {
  const user = await findUserById(userID);
  const project = await findProjectById(projectId);
  return ((user.projects[projectId].annotated.length * project.pricePerImageAnnotation))
  + ((user.projects[projectId].verified.length * project.pricePerImageVerification));
}

export async function percentageOfImagesDone(projectID: ProjectID): Promise<number> {
  const project = await findProjectById(projectID);
  const totalImages = project.images.done.length + project.images.needsAnnotatorAssignment.length + project.images.needsVerifierAssignment.length + project.images.pending.length;
  if (totalImages === 0) {
    return 0;
  }
  const percentage = project.images.done.length / totalImages;
  return percentage;
}

export async function dataChartProjects(projectId: ProjectID): Promise<number[]> {
  const project = await findProjectById(projectId);
  const earningMonth: number[] = new Array(12).fill(0);
  const totIm = project.pricePerImageAnnotation + project.pricePerImageVerification;
  Object.entries(project.images.done).forEach(
    async ([key, value]) => {
      const month = value.doneDate.getMonth();
      earningMonth[month] += totIm;
    },
  );
  return earningMonth;
}

export async function dataChartWorker(userId: UserID): Promise<number[]> {
  const earningPerMonth: number[] = new Array(12).fill(0);
  const user = await findUserById(userId);
  Object.entries(user.projects).forEach(
    async ([key, value]) => {
      const project = await findProjectById(key);
      const priceAnnotation = project.pricePerImageAnnotation;
      const priceVerification = project.pricePerImageVerification;
      // adding earning per month of annotated images
      Object.entries(value.annotated).forEach(
        async ([key, value]) => {
          const month = new Date(value.date).getMonth();
          earningPerMonth[month] += priceAnnotation;
        },
      );
      // adding earning per month of verified images
      Object.entries(value.verified).forEach(
        async ([key, value]) => {
          const month = value.date.getMonth();
          earningPerMonth[month] += priceVerification;
        },
      );
    },
  );
  return earningPerMonth;
}

export default generateReport;
