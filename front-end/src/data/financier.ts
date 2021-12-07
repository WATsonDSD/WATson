import {
  findProjectById, getAllUsers, getProjectsOfUser,
} from '.';
import { findImageById } from './images';

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
        project.images.toVerify.forEach(async (value) => {
          const image = await findImageById(value.imageId);
          if (image.idAnnotator === user.id) { numberOfImages += 1; }
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
async function totalHoursOfWork(projectID: string): Promise<[number, number, number]> {
  const project = await findProjectById(projectID);
  let numberOfImagesAnnotated = 0;
  project.images.done.forEach(async (doneImage) => {
    const image = await findImageById(doneImage.imageId);
    if (image.idAnnotator) { numberOfImagesAnnotated += 1; }
  });
  const hoursAnnotation = ((project.images.toVerify.length + numberOfImagesAnnotated) * project.pricePerImageAnnotation) / project.hourlyRateAnnotation;
  let numberOfImagesVerified = 0;
  project.images.done.forEach(async (doneImage) => {
    const image = await findImageById(doneImage.imageId);
    if (image.idVerifier) { numberOfImagesVerified += 1; }
  });
  const hoursVerification = (numberOfImagesVerified * project.pricePerImageVerification) / project.hourlyRateVerification;
  return [hoursAnnotation + hoursVerification, hoursAnnotation, hoursVerification];
}
/** 
* PROJECT
* number of annotation per project
* number of workers involved (careful with annotator/varifier)
* spending?? DATE
* name-role-annotated images -verified images -hours of work -efficiency -earnings 
* STATISTICS 
* ! TODO 
*/
export default generateReport();
