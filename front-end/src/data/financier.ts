import {
  findProjectById,
  findUserById,
  getAllUsers,
  getProjectsOfUser,
  UserID,
  ProjectID,
  numberOfImagesInProject,
} from '.';

import { initReport, insertReportRow } from './report';

/**
 * this function return a Csv data array with all the fields needed to show up the report * 
 */
export async function generateReport(): Promise<any> {
  const reportId = await initReport();
  // this will be added in the page that generates the reports 
  const listOfUsers = await getAllUsers(); // first column. all of user
  await Promise.all(listOfUsers.map(async (user) => {
    const projectsForUser = await getProjectsOfUser(user.uuid);
    let numberOfImagesAnnotated = 0;
    let numberOfImagesVerified = 0;
    projectsForUser.forEach((project) => {
      numberOfImagesAnnotated = user.projects[project._id].annotated.length;
      numberOfImagesVerified = user.projects[project._id].verified.length;
      const paymentA = (numberOfImagesAnnotated * project.pricePerImageAnnotation);
      const paymentV = (numberOfImagesVerified * project.pricePerImageVerification);
      const hoursA = (numberOfImagesAnnotated * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
      const hoursV = (numberOfImagesVerified * project.pricePerImageVerification) / project.hourlyRateVerification;

      if (numberOfImagesAnnotated > 0) {
        insertReportRow(
          reportId, user.uuid, user.name, user.email, user.role, project.name, hoursA, paymentA, project.client,
        );
      }
      if (numberOfImagesVerified > 0) {
        insertReportRow(
          reportId, user.uuid, user.name, user.email, user.role, project.name, hoursV, paymentV, project.client,
        );
      }
    });
  }));
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
  return (project.workers.length - 2); // 2 for PM and Finance guy 
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
export async function earningsPerUser(userID: UserID): Promise<number> {
  const user = await findUserById(userID);
  let numberAnnotated = 0;
  let numberVerified = 0;
  let totalEarnings = 0;
  await Promise.all(Object.entries(user.projects).map(async ([id, proj]) => {
    numberAnnotated = proj.annotated.length;
    numberVerified = proj.verified.length;
    const project = await findProjectById(id);
    totalEarnings += numberAnnotated * project.pricePerImageAnnotation + numberVerified * project.pricePerImageVerification;
  }));

  return totalEarnings;
}

export async function hoursWorkPerProjectPerUser(userID: UserID, projectId: ProjectID): Promise<number> {
  const user = await findUserById(userID);
  const project = await findProjectById(projectId);
  return ((user.projects[projectId].annotated.length * project.pricePerImageAnnotation) / project.hourlyRateAnnotation)
 + ((user.projects[projectId].verified.length * project.pricePerImageVerification) / project.hourlyRateVerification);
}

export async function hoursWorkPerUser(userID: UserID): Promise<number> {
  const user = await findUserById(userID);
  const projectsForUser = await getProjectsOfUser(userID);
  let hoursA = 0;
  let hoursV = 0;
  let numberOfImagesAnnotated = 0;
  let numberOfImagesVerified = 0;
  // console.log(user);
  projectsForUser.forEach((project) => {
    // console.log('user', user.id, user.projects[project._id]);
    if (user.projects[project._id]) numberOfImagesAnnotated = user.projects[project._id].annotated.length;
    if (user.projects[project._id]) numberOfImagesVerified = user.projects[project._id].verified.length;
    hoursA = (numberOfImagesAnnotated * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
    hoursV = (numberOfImagesVerified * project.pricePerImageVerification) / project.hourlyRateVerification;
  });

  return (hoursV + hoursA);
}

export async function earningsInTotalPerProjectPerUser(userID: UserID, projectId: ProjectID): Promise<number> {
  const user = await findUserById(userID);
  const project = await findProjectById(projectId);
  return ((user.projects[projectId].annotated.length * project.pricePerImageAnnotation))
  + ((user.projects[projectId].verified.length * project.pricePerImageVerification));
}

export async function percentageOfImagesDone(projectID: ProjectID): Promise<number> {
  const project = await findProjectById(projectID);
  const totalImages = await numberOfImagesInProject(projectID);
  if (totalImages === 0) {
    return 0;
  }
  const percentage = project.images.done.length / totalImages;
  console.log(percentage);
  return percentage;
}

export async function dataChartProjects(projectId: ProjectID): Promise<number[]> {
  const project = await findProjectById(projectId);
  const earningMonth: number[] = new Array(12).fill(0);
  const totIm = project.pricePerImageAnnotation + project.pricePerImageVerification;
  Object.entries(project.images.done).forEach(
    async ([_key, value]) => {
      const month = new Date(value.doneDate).getMonth();
      earningMonth[month] += totIm;
    },
  );
  return earningMonth;
}

export async function dataChartWorker(userId: UserID): Promise<number[]> {
  const earningPerMonth: number[] = new Array(12).fill(0);
  const user = await findUserById(userId);
  await Promise.all(Object.entries(user.projects).map(
    async ([key, value]) => {
      const project = await findProjectById(key);
      const priceAnnotation = project.pricePerImageAnnotation;
      const priceVerification = project.pricePerImageVerification;
      // adding earning per month of annotated images
      Object.entries(value.annotated).forEach(
        async ([_key, value]) => {
          const month = new Date(value.date).getMonth();
          earningPerMonth[month] += priceAnnotation;
        },
      );
      // adding earning per month of verified images
      Object.entries(value.verified).forEach(
        async ([_key, value]) => {
          const month = new Date(value.date).getMonth();
          earningPerMonth[month] += priceVerification;
        },
      );
    },
  ));
  return earningPerMonth;
}

export default generateReport;
