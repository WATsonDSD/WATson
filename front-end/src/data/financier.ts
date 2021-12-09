import {
  findProjectById, getAllUsers, getProjectsOfUser,
} from '.';

/**
 * GENERATE REPORT - DOWNLOAD must call this one
* for each user get the list of projects
* for each project of each user get the number of images annotated/verified ,
* the hourly rate and the price per image, calculate the hours: x.lenght(toAnnotate), x.costForHourAnnotation
* get the client x.client
 */

export async function generateReport() {
  const listOfUsers = await getAllUsers();
  listOfUsers.forEach(async (user) => {
    const projectsForUser = await getProjectsOfUser(user.id);
    projectsForUser.forEach((project) => {
      const { client } = project;
      let numberOfImages = 0;
      let hourlyRate = 0;
      let pricePerImage = 0;
      if (user.role === 'annotator') {
        hourlyRate = project.hourlyRateAnnotation;
        pricePerImage = project.pricePerImageAnnotation;
        project.images.done.forEach((image) => {
          if (image.annotator && image.annotator === user.id) { numberOfImages += 1; }
        });
      } else if (user.role === 'verifier') {
        hourlyRate = project.hourlyRateVerification;
        pricePerImage = project.pricePerImageVerification;
        project.images.done.forEach((image) => {
          if (image.verifier && image.verifier === user.id) { numberOfImages += 1; }
        });
      }
      const HHHHH = (numberOfImages * pricePerImage) / hourlyRate;
      console.log(client);
      console.log(numberOfImages);
      console.log(hourlyRate);
      console.log(pricePerImage);
      console.log(HHHHH);
      alert('File creating');
      // TODO: create the file to download 
    });
  });
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

export async function earningsPerUser(userId: string): Promise<number> {
  const projectsForUser = await getProjectsOfUser(userId);
  let earnings = 0;
  projectsForUser.forEach((project) => {
    project.images.done.forEach((image) => {
      if (image.annotator === userId) {
        earnings += project.pricePerImageAnnotation;
      } else if (image.verifier === userId) {
        earnings += project.pricePerImageAnnotation;
      }
    });
  });
  return earnings;
}

/** 
* PROJECT
* total annotation made: just the number of images in done * image.annotation.point
* spending?? DATE
* name-role-annotated images -verified images -hours of work -efficiency -earnings 
*/
export default generateReport;
