import { Project } from ".";
import { Users } from "./dummyData";
import { User, UserID } from "./types";

export async function findUserById(id: UserID): Promise<User> {
    const res = Users[id];
    if (!res) {
        throw Error(`A user with id ${id} does not exist!`);
    }
    return res;
}

/**
 * Finds and returns all users of a given project, regardless of role.
 */
export async function getUsersOfProject(project: Project): Promise<User[]> {
    return Promise.all(
        project.users.map( id => findUserById(id))
    );
}