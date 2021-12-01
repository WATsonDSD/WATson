import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';

import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import {
  AuthDB,
  User,
  // findUserById, Role, User, UserID,
} from '.';

PouchDB.plugin(PouchDBAuthentication);

/**
 * Defines the three possible states for the user session.
 */
enum SessionState {
  /**
   * The user has successfully logged in and a valid
   * AuthSession cookie was found in the browser.
   */
  AUTHENTICATED = 'authenticated',
  /**
   * The authenticator is still fetching for
   * an AuthSession cookie in the browser.
   */
  PENDING = 'pending',
  /**
   * The authenticator fetched for an AuthSession
   * cookie in the browser and found none.
   */
  NONE = 'none',
}

/**
 * Defines the main type that will be exposed by the authenticator.
 * It contains all the information about the user and the state of
 * the session - which is useful when we need to access the user
 * object safely (e.g.: SessionState.AUTHENTICATED means that the
 * user object is not null).
 */
type UserData = [ user: User | null, sessionState: SessionState ];

/**
 * Keeps track of the components that will subscribe to the
 * changes in the user data and session. Each subscriber
 * has a unique id, and is tied to a function that will
 * be responsible for updating it's own user data.
 */
type Subscribers = { [id: string]: (userData: UserData) => void };

/**
 * Init the session state, the user data, and the
 * subscribers as the application (re)loads.
 */
let userData : UserData = [null, SessionState.PENDING];
const subscribers : Subscribers = {};

/**
 * Propagates any changes in user data or session to the subscribers.
 */
function notifySubscribers(userData: UserData) {
  Object.values(subscribers).forEach((callback) => callback(userData));
}

/* eslint-disable no-underscore-dangle */
async function toUserData(userContext: PouchDB.Authentication.UserContext): Promise<User> {
  return new Promise((resolve, reject) => {
    AuthDB.getUser(userContext.name, (error, response) => {
      if (error) {
        reject(error);
      } else if (response) {
        const responseJSON = JSON.parse(JSON.stringify(response));

        const user = {
          id: responseJSON._id,
          projects: responseJSON.projects,
          name: responseJSON.fullname,
          email: responseJSON.name,
          role: responseJSON.roles[0],
        } as User;

        console.log(user);
        resolve(user);
      } else {
        // TODO: when could the response be undefined | null?
      }
    });
  });
}

async function updateUserData(): Promise<UserData> {
  return new Promise((resolve, reject) => {
    AuthDB.getSession(async (error, response) => {
      if (error) {
        reject(error);
      } else if (!response?.userCtx.name) {
        // Nobody's is logged in
        userData = [null, SessionState.NONE];
      } else {
        // response.userCtx contains the current logged in user
        userData = [await toUserData(response.userCtx), SessionState.AUTHENTICATED];
      }
      console.log(userData);
      notifySubscribers(userData);
      resolve(userData);
    });
  });
}

export async function logIn(email: string, password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    AuthDB.logIn(email, password, (error) => {
      if (error) {
        reject(error);
      } else {
        updateUserData().then((data) => {
          console.log(data);
          resolve(true);
        });
      }
    });
  });
}

export function useUserData(): UserData {
  const [_userData, setData] = useState<UserData>(userData);

  // Each component that invokes this hook will have a unique subscriberID
  const subscriberID = uuid();

  useEffect(() => {
    // Setting the callback function for the new subscriber
    subscribers[subscriberID] = (newUserData: UserData) => setData(newUserData);

    return () => {
      delete subscribers[subscriberID];
    };
  }, []);

  return _userData;
}
// /**
//  * Updates the current user context to match the one in the cookies (if any).
//  * It's necessary to restore the user information when the application is reloaded
//  * in the browser while a valid user session is still present.
//  */
// async function updateSessionState(): Promise<SessionState> {
//   return new Promise((resolve, reject) => {
//     db.getSession((err, response) => {
//       console.log(err, response);
//       if (err) {
//         reject(err.name);
//       } else if (!response?.userCtx.name) {
//         sessionState = null;
//         notifySubscribers(null);
//       } else {
//         UserCtxToUser(response.userCtx).then((val) => resolve(val));
//       }
//     });
//   });
// }

// async function UserCtxToUser(userCtx: PouchDB.Authentication.UserContext): Promise<SessionState> {
//   let userId: string;
//   if (userCtx.roles?.findIndex((role) => role === '_admin') !== -1) {
//     userId = 'adminId';
//   } else { userId = userCtx.roles?.find((role) => role !== 'projectManager' && role !== 'annotator' && role !== '_admin') as string; }
//   console.log(userId);
//   const user = await findUserById(userId);
//   sessionState = user;
//   notifySubscribers(user);
//   return user;
//   // return new Promise((resolve) => {
//   //   db.getUser(userCtx.name, (e, r) => {
//   //     if (e) {
//   //       if (e.name === 'not_found') {
//   //         // typo, or you don't have the privileges to see this user
//   //       } else {
//   //         // some other error
//   //       }
//   //     } else {
//   //       //! this is where we can screw up
//   //       findUserById((r as any).id).then((user) => {
//   //         sessionState = user;
//   //         notifySubscribers(user);
//   //         resolve(user);
//   //       });
//   //     }
//   //   });
//   // });
// }

// /**
//  * Authenticates the user and creates a session cookie that will be used
//  * to validate following requests to the database.
//  */
// export async function logIn(email: string, password: string): Promise<SessionState> {
//   return new Promise((resolve, reject) => {
//     db.logIn(email, password, (err) => {
//       if (err) {
//         if (err.name === 'unauthorized' || err.name === 'forbidden') {
//           reject(new AuthError(Errors.InvalidCredentials).name);
//         }
//         reject(err.name);
//       }
//       updateSessionState()
//         .then((res) => {
//           resolve(res);
//         });
//     });
//   });
// }

// /**
//  * Signs up a new user who didn't exist yet.
//  */
// export async function signUp(email: string, password: string, role: Role, id: UserID): Promise<void> {
//   return new Promise((resolve, reject) => {
//     db.signUp(email, password, {
//       roles: [role, id],
//     }, (err, response) => {
//       if (err) {
//         reject(err.name);
//       }
//       if (response) {
//         resolve();
//       }
//       reject();
//     });
//   });
// }

// /**
//  * Ends the current user session and deletes the session cookie from the browser.
//  * Any request should be denied from here on forward.
//  */
// export async function logOut(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     // A valid user needs to be signed in
//     if (sessionState === null) {
//       reject(new AuthError(Errors.InvalidContext).name);
//     }

//     db.logOut((err) => {
//       if (err) {
//         reject(err.name);
//       } else {
//         // set userData to nulll
//         updateSessionState()
//           .then(() => {
//             resolve();
//           });
//       }
//     });
//   });
// }

// export function useUserContext(): SessionState {
//   const [context, setContext] = useState<SessionState>(sessionState);

//   useEffect(() => {
//     const id : string = uuid();

//     sessionSubscribers[id] = (updatedContext: SessionState) => setContext(updatedContext);
//     updateSessionState();

//     return () => {
//       delete sessionSubscribers[id];
//     };
//   }, []);

//   return context;
// }
