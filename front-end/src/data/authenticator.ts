import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';

import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import { AuthDB, User, Role } from '.';

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

/**
 * Fetches the user details and converts the userCtx object
 * returned by the pouchdb api into a useful User type
 * that's more easily consumed throughout the application.
 */
async function fromCtxToUserData(userContext: PouchDB.Authentication.UserContext): Promise<User> {
  return new Promise((resolve, reject) => {
    AuthDB.getUser(userContext.name, (error, response) => {
      if (error) {
        reject(error);
      } else if (response) {
        const responseJSON = JSON.parse(JSON.stringify(response));

        const user = {
          id: responseJSON._id,
          email: responseJSON.name,
          name: responseJSON.fullname,
          role: responseJSON.roles[0],
          projects: responseJSON.projects,
        } as User;

        resolve(user);
      } else {
        // TODO: HANDLE THE UNDEFINED RESPONSE HERE
      }
    });
  });
}

/**
 * Checks for the existence of a valid authentication session
 * in the browser's cookies and updates the userData variable
 * to match the state of that session.
 */
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
        userData = [await fromCtxToUserData(response.userCtx), SessionState.AUTHENTICATED];
      }
      notifySubscribers(userData);
      resolve(userData);
    });
  });
}

/**
 * Authenticates the user and creates a session cookie that
 * will be used to validate following requests to the database.
 */
export async function logIn(email: string, password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    AuthDB.logIn(email, password, (error, response) => {
      if (error) {
        // Email or password might be incorrent
        reject(error);
      } else if (response) {
        updateUserData().then(() => {
          resolve(true);
        });
      } else {
        // Something went wrong...
        resolve(false);
      }
    });
  });
}

/**
 * Signs up a new user who didn't exist yet and sets
 * up the right permissions for each database this
 * user should have access to.
 */
export async function signUp(name: string, email: string, password: string, role: Role): Promise<boolean> {
  return new Promise((resolve, reject) => {
    AuthDB.signUp(email, password, {
      roles: [role],
      metadata: {
        fullname: name,
        projects: {},
      },
    }, (error, response) => {
      if (error) {
        // The user already exists or you don't have the right permissions to add him to the database
        reject(error);
      } else if (response) {
        // TODO: add user permissions
        resolve(true);
      } else {
        // Something went wrong...
        resolve(false);
      }
    });
  });
}

/**
 * Ends the current user session and erases the session cookie from
 * the browser. Any request should be denied from here on forward.
 */
export async function logOut(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    AuthDB.logOut((error, response) => {
      if (error) {
        // Network error
        reject(error);
      } else if (response) {
        // When the logout is successfull, updateUserData should return [null, 'none']
        updateUserData().then(() => {
          resolve(true);
        });
      } else {
        // Something went wrong...
        resolve(false);
      }
    });
  });
}

/**
 * This hook exposes the user data and session
 * state to any component that invokes it.
 */
export function useUserData(): UserData {
  const [_userData, setData] = useState<UserData>(userData);

  // Each component that invokes this hook will have a unique subscriberID
  const subscriberID = uuid();

  useEffect(() => {
    // Setting the callback function for the new subscriber
    subscribers[subscriberID] = (newUserData: UserData) => setData(newUserData);

    // Update the user data only if the sessionState is still pending
    if (_userData[1] === SessionState.PENDING) {
      updateUserData();
    }

    return () => {
      delete subscribers[subscriberID];
    };
  }, []);

  return _userData;
}

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
// }
