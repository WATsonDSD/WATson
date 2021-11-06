import { Project, ProjectID, User } from ".";
import { Projects } from "./dummyData";

export async function findProjectById(id: ProjectID): Promise<Project>{
    const res = Projects[id];
    if (!res) {
        throw Error(`A project with id ${id} does not exist!`);
    }
    return res;
}

/**
 * Finds and returns all projects of a user.
 */
export async function getProjectsOfUser(user: User): Promise<Project[]> {
    return Promise.all(
        user.projects.map( id => findProjectById(id))
    );
}