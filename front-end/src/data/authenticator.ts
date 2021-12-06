import axios from 'axios';

import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import {
  AuthDB, User, Role, findUserById,
} from '.';

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

export async function updateUser(user: User): Promise<void> {
  return new Promise((resolve, reject) => {
    AuthDB.putUser(user.email, {
      roles: [user.role],
      metadata: {
        fullname: user.name,
        projects: user.projects,
      },
    }, (error, response) => {
      if (error) {
        reject(error);
      } else if (response) {
        resolve();
      } else {
        // TODO: Eventually it will be ideal to throw custom errors
        reject(new Error('Undefined response.'));
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
        userData = [await findUserById(response.userCtx.name), SessionState.AUTHENTICATED];
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
 * Helper function that sets user's permissions
 * so that he can have access to the databases.
 */
async function setUserPermissions(email: string) : Promise<boolean> {
  let result: boolean = false;

  // ! 'http://localhost:8080' will need to change for this to be deployable
  await axios.post('http://localhost:8080/setUserPermissions', { email })
    .then((response) => {
      result = response as unknown as boolean;
    }).catch((error) => {
      console.log(error);
    });

  return result;
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
        /**
         * The user already exists or you don't have the
         * right permissions to add him to the database.
         */
        reject(error);
      } else if (response) {
        resolve(setUserPermissions(email));
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
 * 
 * @example const [user, sessionState] = useUserData();
 * @example const [user] = useUserData(); // When you only care about the user object
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
