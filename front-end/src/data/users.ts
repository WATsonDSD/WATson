import {
  signUp, findProjectById, Role, User, ProjectID, UserID, AuthDB,
} from '.';

const IDPrefix: string = 'org.couchdb.user:';

/* eslint-disable no-underscore-dangle */

/**
 * Fetches the user corresponding to a certain id.
 */
export async function findUserById(id: UserID): Promise<User> {
  return new Promise((resolve, reject) => {
    /**
     * Under the hood, the getUser function calls a PouchDB function that
     * takes the username as a parameter for search. Luckily, user ids
     * and usernames are strictly tied together. In particular, each
     * id follows this pattern: 'org.couchdb.user:{username}'. This
     * allows us to swap id and username internally.
     */
    AuthDB.getUser(id.substring(IDPrefix.length), (error, response: any) => {
      if (error) {
        reject(error);
      } else if (response) {
        const user: User = {
          id: response._id,
          email: response.name,
          name: response.fullname,
          role: response.roles[0],
          projects: response.projects,
        };

        resolve(user);
      } else {
        // TODO: Eventually it will be ideal to throw custom errors
        reject(new Error('Undefined response.'));
      }
    });
  });
}

/**
 * Fetches and returns all the users of a given project.
 */
export async function getUsersOfProject(projectId: ProjectID): Promise<User[]> {
  return Promise.all(
    (await findProjectById(projectId)).users.map((id) => findUserById(id)),
  );
}

/* eslint-disable no-underscore-dangle */

/**
 * Fetches all the users registered on the application, regardless of role. 
 */
export async function getAllUsers(): Promise<User[]> {
  let users: User[] = [];

  return new Promise((resolve, reject) => {
    AuthDB.allDocs({
      startkey: 'a', // excludes the design documents
      include_docs: true,
    }).then((response) => {
      if (response) {
        users = response.rows.map((row: any) => row.map((doc: any) => ({
          id: doc._id,
          email: doc.name,
          name: doc.fullname,
          role: doc.roles[0],
          projects: doc.projects,
        } as User)));
      }
      resolve(users);
    }).catch((error) => {
      reject(error);
    });
  });
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
  return IDPrefix + email;
}
