import { Images } from "./dummyData";
import { ImageID, Image, ProjectID, UserID, findUserById, findProjectById } from ".";

export async function findImageById(id: ImageID): Promise<Image> {
    const res = Images[id];
    if (!res) {
        throw Error(`An image with id ${id} does not exist!`);
    }
    return res;
}

/**
 * Finds and returns images with the given `status` in a given `project`. 
 * If the `user` parameter is specified, returns images assigned to that `User` only.
 */
export async function getImages(
    projectID: ProjectID,
    status: 'toAnnotate' | 'toVerify' | 'done',
    userID: UserID | null = null,
): Promise<Image[]> {
    if (userID) {
        const user = await findUserById(userID);
        return Promise.all( user.projects[projectID][status].map( (id) => findImageById(id))); 
    }
    const project = await findProjectById(projectID);
    return Promise.all( project.images[status].map( (id) => findImageById(id)));
}