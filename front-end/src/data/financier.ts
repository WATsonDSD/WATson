// create a list of all annotators and verifiers, all users

import { getAllUsers, getProjectsOfUser } from '.';

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
      let hourlyrate;
      let princePerImage;
      if (user.role === 'annotator') {
        hourlyrate = project.hourlyRateAnnotation;
        princePerImage = project.pricePerImageAnnotation;
        project.images.done.forEach((image) => {
          if (image.annotator != null) { numberOfImages += 1; }
        });
      } else if (user.role === 'verifier') {
        hourlyrate = project.hourlyRateVerification;
        princePerImage = project.pricePerImageVerification;
        project.images.done.forEach((image) => {
          if (image.verifier != null) { numberOfImages += 1; }
        });
      }
      console.log(client);
      console.log(numberOfImages);
      console.log(hourlyrate);
      console.log(princePerImage);
      // TODO: create the file to download 
    });
  });
}

export default generateReport();
