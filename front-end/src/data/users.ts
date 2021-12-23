import {
  signUp,
  findProjectById,
  Role,
  User,
  ProjectID,
  UserID,
  AuthDB,
} from '.';

import {
  FetchingError,
  UserNotFoundError,
  UpdateError,
  UpdateUserError,
  CreateUserError,
} from '../utils/errors';

export const IDPrefix: string = 'org.couchdb.user:';

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
     * 
     * P.S.: We adopt the user email as his username.
     */
    const email = id.substring(IDPrefix.length);

    AuthDB.getUser(email, (error, response: any) => {
      if (error) {
        if (error.name === 'not_found') {
          reject(new UserNotFoundError());
        } else {
          reject(new FetchingError(error.message));
        }
      } else if (response) {
        const user: User = {
          id: response._id,
          email: response.name,
          name: response.fullname,
          role: response.roles[0],
          projects: response.projects,
          workDoneInTime: response.workDoneInTime,
        };

        resolve(user);
      } else {
        reject(new FetchingError());
      }
    });
  });
}

export async function updateUser(user: User): Promise<void> {
  return new Promise((resolve, reject) => {
    AuthDB.putUser(user.email, {
      roles: [user.role],
      metadata: {
        fullname: user.name,
        projects: user.projects,
        workDoneInTime: user.workDoneInTime,
      },
    }, (error, response) => {
      if (error) {
        reject(new UpdateUserError());
      } else if (response) {
        resolve();
      } else {
        reject(new UpdateError());
      }
    });
  });
}

/**
 * Fetches and returns all the users of a given project.
 */
// TODO: Use ProjectsDB.allDocs with the keys parameter instead
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
        users = response.rows.map((row: any) => ({
          id: row.doc._id,
          email: row.doc.name,
          name: row.doc.fullname,
          role: row.doc.roles[0],
          projects: row.doc.projects,
        } as User));
      }
      resolve(users);
    }).catch(() => {
      reject(new FetchingError());
    });
  });
}

/**
 * Adds a new user to the application.
 */
export async function createUser(name: string, email: string, role: Role): Promise<UserID> {
  return new Promise((resolve, reject) => {
    /**
     * We don't want the project manager to manually set the password
     * for each user he adds to the application. For this reason the
     * initial password will be set as a substring of the email.
     * 
     * @example: email: 'cemcebeci@watson.com' ---> password: 'cemcebeci'
     */
    const password = email.substring(0, email.lastIndexOf('@'));

    // Signing up the user
    signUp(name, email, password, role)
      .then((result) => {
        /**
         * Since we are adopting CouchDB as the underying
         * [authentication] database, and because of the
         * predictable nature of the id that it generates,
         * we can get away with hard-coding the user id.
         */
        if (result) {
          resolve(IDPrefix + email);
        } else {
          reject(new CreateUserError());
        }
      })
      .catch((error) => reject(new CreateUserError(error.message)));
  });
}

/**
 * Returns the number of images a user has annotated and modified (in a project, if specified) in the specified time.
 * Do keep in mind that month numbers start from 0 ( January -> 0, May -> 4 ...)
 */
export async function getWorkDoneByUser(
  userId: UserID,
  time: { year: string, month?: string, day?: string},
  projectID?: ProjectID,
): Promise<{annotation: number, verification: number}> {
  /** 
   * Helper function that mutates the target.
   */
  function addDaysWork(dayEntry: typeof workDoneInTimeSlot, target: typeof workDoneInTimeSlot) {
    Object.entries(dayEntry).forEach(([projectId, work]) => {
      // eslint-disable-next-line no-param-reassign
      if (!target[projectId]) { target[projectId] = { annotated: [], verified: [] }; }
      // eslint-disable-next-line no-param-reassign
      target[projectId].annotated = target[projectId].annotated.concat(work.annotated);
      // eslint-disable-next-line no-param-reassign
      target[projectId].verified = target[projectId].verified.concat(work.verified);
    });
  }

  const user = await findUserById(userId);

  // aggregate all work done in the given period of time.
  // this part is not very easy on the eyes, I'm up to implement a better suggestion.
  let workDoneInTimeSlot : {[projectID: string]: {annotated: string[], verified: string[]}};
  if (time.month) {
    if (time.day) {
      workDoneInTimeSlot = user.workDoneInTime[time.year]?.[time.month]?.[time.day];
    } else {
      workDoneInTimeSlot = {};
      const monthlyWork = user.workDoneInTime[time.year]?.[time.month];
      if (monthlyWork) {
        Object.values(monthlyWork).forEach((day) => {
          addDaysWork(day, workDoneInTimeSlot);
        });
      }
    }
  } else {
    workDoneInTimeSlot = {};
    const yearlyWork = user.workDoneInTime[time.year];
    if (yearlyWork) {
      Object.values(yearlyWork).forEach((monthlyWork) => {
        Object.values(monthlyWork).forEach((day) => {
          addDaysWork(day, workDoneInTimeSlot);
        });
      });
    }
  }

  if (projectID) {
    return {
      annotation: workDoneInTimeSlot[projectID].annotated.length,
      verification: workDoneInTimeSlot[projectID].verified.length,
    };
  }
  let numAnnotations = 0;
  let numVerifications = 0;
  Object.values(workDoneInTimeSlot).forEach((entry) => {
    numAnnotations += entry.annotated.length;
    numVerifications += entry.verified.length;
  });
  return { annotation: numAnnotations, verification: numVerifications };
}
