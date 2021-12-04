import axios from 'axios';

import {
  signUp, getUser, findProjectById, Role, User, ProjectID, UserID,
} from '.';

/**
 * Fetches the user corresponding to a certain id.
 */
export async function findUserById(id: UserID): Promise<User> {
  /**
   * Under the hood, the getUser function calls a PouchDB function that
   * takes the username as a parameter for search. Luckily, user ids
   * and usernames are strictly tied together. In particular, each
   * id follows this pattern: 'org.couchdb.user:{username}'. This
   * allows us to swap id and username internally.
   */
  return getUser(id.substring(17));
}

/**
 * Fetches and returns all the users of a given project.
 */
export async function getUsersOfProject(projectId: ProjectID): Promise<User[]> {
  return Promise.all(
    (await findProjectById(projectId)).users.map((id) => findUserById(id)),
  );
}

/**
 * Fetches all the users registered on the application, regardless of role. 
 */
export async function getAllUsers(): Promise<User[]> {
  let users: User[] = [];

  // ! 'http://localhost:8080' will need to change for this to be deployable
  await axios.get('http://localhost:8080/getAllUsers')
    .then((response) => {
      users = response as unknown as User[];
    }).catch((error) => {
      console.log(error);
    });

  return users;
}

/**
 * Adds a new user to the application.
 */
export async function createUser(name: string, email: string, role: Role): Promise<UserID> {
  /**
   * We don't want the project manager to manually set the password
   * for each user he adds to the application. For this reason the
   * initial password will be set as a substring of the email.
   * 
   * @example: email: 'cemcebeci@watson.com' ---> password: 'cemcebeci'
   */
  const password = email.substring(0, email.lastIndexOf('@'));

  // Signing up the user
  await signUp(name, email, password, role);

  /**
   * Since we are adopting CouchDB as the underying
   * [authentication] database, and because of the
   * predictable nature of the id that it generates,
   * we can get away with hard-coding the user id.
   */
  return `org.couchdb.user:${email}`;
}
