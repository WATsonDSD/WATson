import {
  signUp,
  findProjectById,
  Role,
  Worker,
  ProjectID,
  UserID,
  AuthDB,
  ProjectsDB,
  assignVerifier,
  findAnnotatorBlockOfProject,
  WorkersDB,
} from '.';

import {
  FetchingError,
  UserNotFoundError,
  UpdateUserError,
  CreateUserError,
} from '../utils/errors';

export const IDPrefix: string = 'org.couchdb.user:';

/**
 * Fetches the user corresponding to a certain id.
 */
export async function findUserByAuthId(id: UserID): Promise<Worker> {
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
        const { uuid } = response;
        WorkersDB.get(uuid)
          .then((response) => {
            resolve(response);
          })
          .catch(() => reject(new FetchingError()));
      } else {
        reject(new FetchingError());
      }
    });
  });
}

export async function findUserById(id: UserID): Promise<Worker> {
  return new Promise((resolve, reject) => {
    WorkersDB.get(id)
      .then((response) => {
        resolve(response);
      })
      .catch(() => reject(new UserNotFoundError()));
  });
}

export async function updateUser(user: Worker): Promise<void> {
  return new Promise((resolve, reject) => {
    /**
    * ? This comment will be useful in another pull request 
    * ? This function will only update the user in the WorkersDB.
    * ? The changeEmail function will update the user in AuthDB as
    * ? well, and that's possible because each user can change their
    * ? own email though AuthDB.
    * 
    * ? promoteToVerifier will modify the user in AuthDB as well,
    * ? and that's possible because the pm is an admin server!
    */
    //   AuthDB.putUser(user.email, {
    //     roles: [user.role],
    //     metadata: {
    //       uuid: user._id,
    //     },
    //   }, (error, response) => {
    //     if (error) {
    //       reject(new UpdateUserError());
    //     } else if (response) {
    //       WorkersDB.put(user)
    //         .then(() => resolve())
    //         .catch(() => reject(new UpdateError()));
    //     } else {
    //       reject(new UpdateError());
    //     }
    //   });
    // });
    WorkersDB.put(user)
      .then(() => resolve())
      .catch(() => reject(new UpdateUserError()));
  });
}

/**
 * Fetches and returns all the users of a given project.
 */
// TODO: Use ProjectsDB.allDocs with the keys parameter instead
export async function getUsersOfProject(projectId: ProjectID): Promise<Worker[]> {
  return Promise.all(
    (await findProjectById(projectId)).users.map((id) => findUserById(id)),
  );
}

/**
 * Fetches all the users registered on the application, regardless of role. 
 */
export async function getAllUsers(): Promise<Worker[]> {
  let users: Worker[] = [];
  return new Promise((resolve, reject) => {
    WorkersDB.allDocs({
      include_docs: true,
    }).then((response) => {
      if (response) {
        users = response.rows.map((row) => row.doc!);
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
 * if the annotator has not a verifier assigned, it creates the new link
 */
export async function createAnnotatorVerifierLink(projectId: ProjectID, annotatorId: UserID, verifierId: UserID): Promise<void> {
  const project = await findProjectById(projectId);
  const annVerLinks = project.annVer;
  annVerLinks.forEach((anVer) => {
    if (anVer.annotatorId === annotatorId) throw Error('annotator has already been assigned to a verifier');
  });
  const block = await findAnnotatorBlockOfProject(projectId, annotatorId);
  // se già esiste un blocco 
  if (block) {
    await assignVerifier(block.blockId, verifierId, projectId);
  } else {
    project.annVer.push({ annotatorId, verifierId });
    await ProjectsDB.put(project);
  }
}
/*
 * export async function changeEmail(email: string) {}
 * 
 * 1 - change user.id
 * 2 - change user.email
 * 3 - change user.id in every project.users
 * 4 - change user.id in every project.workDoneInTime
 * 5 - change user.id in every image
 * 6 - change user.id in every rejection
 * 
 * Better approach: each user has a uid, different from his couchdb id.
 * Every other type will reference the user.uid instead of the user.id.
 * This way, a change in email won't change the reference of the other
 * types.
 * 
 * TODO: wait for model changes to implement this
 */

export async function changePassword(email: string, password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    AuthDB.changePassword(email, password, (error) => {
      if (error) {
        if (error.name === 'not_found') {
          reject(new UpdateUserError('You may not have the right permissions to change this user\'s password. Make sure you typed a valid password.'));
        } else {
          reject(new UpdateUserError());
        }
      } else {
        resolve(true);
      }
    });
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
    if (!workDoneInTimeSlot[projectID]) { return { annotation: 0, verification: 0 }; }
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
