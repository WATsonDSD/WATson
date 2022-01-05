import {
  DBDocument,
  User,
  getAllUsers,
  getProjectsOfUser,
  Project,
  numberOfImagesInProject,
  Report,
  ReportsDB,
  initReport,
  insertReportRow,
} from '.';

import { UploadError } from '../utils/errors';

export async function createReport(): Promise<void> {
  let report: Report & { _id: string } = initReport();

  const users: DBDocument<User>[] = await getAllUsers();

  await Promise.all(users.map(async (user) => {
    const projectsOfUser: DBDocument<Project>[] = await getProjectsOfUser(user);

    projectsOfUser.forEach((project) => {
      const numberOfImagesAnnotated = user.projects[project._id].annotated.length;
      const numberOfImagesVerified = user.projects[project._id].verified.length;

      const earningsFromAnnotations = (numberOfImagesAnnotated * project.pricePerImageAnnotation);
      const earningsFromVerifications = (numberOfImagesVerified * project.pricePerImageVerification);

      const hoursOfAnnotation = (numberOfImagesAnnotated * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
      const hoursOfVerification = (numberOfImagesVerified * project.pricePerImageVerification) / project.hourlyRateVerification;

      if (numberOfImagesAnnotated > 0) {
        report = insertReportRow(
          report,
          user.uuid,
          user.name,
          user.email,
          user.role,
          project.name,
          project.client,
          hoursOfAnnotation,
          earningsFromAnnotations,
        );
      }
      if (numberOfImagesVerified > 0) {
        report = insertReportRow(
          report,
          user.uuid,
          user.name,
          user.email,
          user.role,
          project.name,
          project.client,
          hoursOfVerification,
          earningsFromVerifications,
        );
      }
    });
  }));

  await ReportsDB.put(report).catch(() => new UploadError('The report could not be uploaded as requested.'));
}

export function calculateProjectCost(project: DBDocument<Project>): [number, number, number] {
  const doneImages = project.images.done.length;

  const annotationsCost = (doneImages * project.pricePerImageAnnotation);
  const verificationsCost = (doneImages * project.pricePerImageVerification);

  return [verificationsCost + annotationsCost, annotationsCost, verificationsCost];
}

export function totalHoursOfWork(project: DBDocument<Project>): [number, number, number] {
  const doneImages = project.images.done.length;

  const hoursOfAnnotation = ((doneImages) * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
  const hoursOfVerification = (doneImages * project.pricePerImageVerification) / project.hourlyRateVerification;

  return [hoursOfAnnotation + hoursOfVerification, hoursOfAnnotation, hoursOfVerification];
}

export function numberOfAnnotationsInProject(project: DBDocument<Project>): number {
  return project.images.done.length;
}

export function numberOfWorkersInProject(project: DBDocument<Project>): number {
  return (project.workers.length - 2); // 2 for PM and Finance 
}

export function userEarningsFromProject(project: DBDocument<Project>, user: DBDocument<User>): [number, number] {
  const numberOfImagesAnnotated = user.projects[project._id].annotated.length;
  const numberOfImagesVerified = user.projects[project._id].verified.length;

  return [numberOfImagesAnnotated * project.pricePerImageAnnotation, numberOfImagesVerified * project.pricePerImageVerification];
}

export async function earningsPerUser(user: DBDocument<User>): Promise<number> {
  const projectsOfUser: DBDocument<Project>[] = await getProjectsOfUser(user);

  const earnings: number = projectsOfUser.map((project) => {
    const earningsFromAnnotations = user.projects[project._id].annotated.length * project.pricePerImageAnnotation;
    const earningsFromVerifications = user.projects[project._id].verified.length * project.pricePerImageVerification;

    return earningsFromAnnotations + earningsFromVerifications;
  }).reduce((accumulatedEarnings, currentEarnings) => accumulatedEarnings + currentEarnings);

  return earnings;
}

export function hoursOfWorkOfUserFromProject(user: DBDocument<User>, project: DBDocument<Project>): number {
  const [earningsFromAnnotations, earningsFromVerifications] = userEarningsFromProject(project, user);

  const hoursOfAnnotation = (earningsFromAnnotations / project.hourlyRateAnnotation);
  const hoursOfVerifications = (earningsFromVerifications / project.hourlyRateVerification);

  return hoursOfAnnotation + hoursOfVerifications;
}

export async function hoursOfWorkOfUser(user: DBDocument<User>): Promise<number> {
  const projectsOfUser: DBDocument<Project>[] = await getProjectsOfUser(user);

  if (projectsOfUser.length === 0) return 0;

  const hoursOfWork: number = projectsOfUser
    .map((project) => hoursOfWorkOfUserFromProject(user, project))
    .reduce((accumulatedHoursOfWork, currentHoursOfWork) => accumulatedHoursOfWork + currentHoursOfWork);

  return hoursOfWork;
}

export function percentageOfImagesDone(project: DBDocument<Project>): number {
  const numberOfImages: number = numberOfImagesInProject(project);
  const numberOfDoneImages: number = numberOfAnnotationsInProject(project);

  if (numberOfImages === 0) return 0;

  return numberOfDoneImages / numberOfImages;
}

export function projectEarningsPerMonth(project: DBDocument<Project>): number[] {
  const earningsPerMonth: number[] = new Array(12).fill(0);

  const costOfDoneImage = project.pricePerImageAnnotation + project.pricePerImageVerification;

  Object.values(project.images.done).forEach((image) => {
    const month = image.doneDate.getMonth();
    earningsPerMonth[month] += costOfDoneImage;
  });

  return earningsPerMonth;
}

export async function workerEarningsPerMonth(user: DBDocument<User>): Promise<number[]> {
  const projectsOfUser: DBDocument<Project>[] = await getProjectsOfUser(user);

  const earningsPerMonth: number[] = new Array(12).fill(0);

  projectsOfUser.forEach((project) => {
    const earningFromAnnotation = project.pricePerImageAnnotation;
    const earningFromVerification = project.pricePerImageVerification;

    user.projects[project._id].annotated.forEach((image) => {
      const month = image.date.getMonth();
      earningsPerMonth[month] += earningFromAnnotation;
    });

    user.projects[project._id].verified.forEach((image) => {
      const month = image.date.getMonth();
      earningsPerMonth[month] += earningFromVerification;
    });
  });

  return earningsPerMonth;
}

export default createReport;
