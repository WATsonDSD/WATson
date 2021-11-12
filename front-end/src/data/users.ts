import { Project } from '.';
import { Users } from './dummyData';
import { Role, User, UserID } from './types';

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
    project.users.map((id) => findUserById(id)),
  );
}

/**
 * Creates a new `User`.
 * @returns The newly created user's `id`, determined by the backend.
 * 
 * @example
 * const efflamsId = await createUser('Efflam Simone', 'efflam@watson.com', 'annotator');
 * // returns 'Efflam Simone'
 * getUserById(efflamsId).then(user => user.name);
 */
export async function createUser(name: string, email: string, role: Role): Promise<UserID> {
  // unique Id's, should work for now.
  const id = new Date().toISOString();

  Users[id] = {
    id,
    name,
    email,
    role,
    projects: {}, // a new user has no projects.
  };

  return id;
}
