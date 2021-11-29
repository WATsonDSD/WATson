import { findProjectById, ProjectID, signUp } from '.';
import { usersDB } from './databases';
import { Role, User, UserID } from './types';

export async function findUserById(id: UserID): Promise<User> {
  return usersDB.get(id);
}

/**
 * Finds and returns all users of a given project, regardless of role.
 */
export async function getUsersOfProject(projectId: ProjectID): Promise<User[]> {
  return Promise.all(
    (await findProjectById(projectId)).users.map((id) => findUserById(id)),
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
  const id = `${Math.ceil(Math.random() * 123412341)}`;
  const tempPassword = email.substring(0, email.lastIndexOf('@'));

  console.log('signing up');
  console.log(email, tempPassword, role, id);
  // register the user in the auth DB.
  await signUp(email, tempPassword, role, id);

  console.log('putting the user');
  const user = {
    _id: id,
    id,
    name,
    email,
    role,
    projects: {}, // a new user has no projects.
  };

  await usersDB.put(user);

  return id;
}
