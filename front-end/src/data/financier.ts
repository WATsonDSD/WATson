import { findProjectById, getAllUsers, getProjectsOfUser } from '.';

// for each user get the list of projects
// for each project of each user get the number of images annotated/verified ,
// the hourly rate and the price per image, calculate the hours: x.lenght(toAnnotate), x.costForHourAnnotation
// get the client x.client
export async function generateReport() {
  const listOfUsers = await getAllUsers();
  listOfUsers.forEach(async (user) => {
    // let projectsForUser: any[] | Promise<Project[]>; 
    const projectsForUser = await getProjectsOfUser(user.id);
    projectsForUser.forEach((project) => {
      const { client } = project;
      let numberOfImages = 0;
      let hourlyrate = 0;
      let princePerImage = 0;
      if (user.role === 'annotator') {
        hourlyrate = project.hourlyRateAnnotation;
        princePerImage = project.pricePerImageAnnotation;
        project.images.done.forEach((image) => {
          if (image.annotator && image.annotator === user.id) { numberOfImages += 1; }
        });
        project.images.toVerify.forEach((image) => {
          if (image.annotator && image.annotator === user.id) { numberOfImages += 1; }
        });
      } else if (user.role === 'verifier') {
        hourlyrate = project.hourlyRateVerification;
        princePerImage = project.pricePerImageVerification;
        project.images.done.forEach((image) => {
          if (image.verifier && image.verifier === user.id) { numberOfImages += 1; }
        });
      }
      const HHHHH = (numberOfImages * princePerImage) / hourlyrate;
      console.log(client);
      console.log(numberOfImages);
      console.log(hourlyrate);
      console.log(princePerImage);
      console.log(HHHHH);
      alert('File creating');
      // TODO: create the file to download 
    });
  });
}

// total amount of money 
// total amount per current month ???? 
// summary how much per month / per project
// archivied project
export async function projectSummary(projectID: string) {
  let total = 0;
  const project = await findProjectById(projectID);
  let totalAnnotated = 0;
  let totalVerified = 0;
  project.images.done.forEach((image) => {
    if (image.annotator) { totalAnnotated += 1; }
  });
  project.images.done.forEach((image) => {
    if (image.verifier) { totalVerified += 1; }
  });
  totalAnnotated += project.images.toVerify.length;
  total = totalAnnotated * project.pricePerImageAnnotation + totalVerified * project.pricePerImageVerification;
  console.log(total);
}

export default generateReport();
