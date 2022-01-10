import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import {
  AuthDB,
  Worker,
  Role,
  findUserByAuthId,
  IDPrefix,
  WorkersDB,
} from '.';

import {
  NetworkError,
  AuthenticationError,
  UserAlreadyExistsError,
  InvalidCredentialsError,
  IncorrectCredentialsError,
} from '../utils/errors';
import { notifyReplicators } from './PouchWrapper/ReplicatedWrapper';

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
type UserData = [ user: Worker | null, sessionState: SessionState ];

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

/**
 * Checks for the existence of a valid authentication session
 * in the browser's cookies and updates the userData variable
 * to match the state of that session.
 */
async function updateUserData(): Promise<UserData> {
  return new Promise((resolve, reject) => {
    AuthDB.getSession(async (error, response) => {
      if (error) {
        // Network error
        reject(new NetworkError(error.message));
      } else if (!response?.userCtx.name) {
        // Nobody's is logged in
        userData = [null, SessionState.NONE];
      } else {
        notifyReplicators();
        // response.userCtx contains the current logged in user
        await findUserByAuthId(IDPrefix + response.userCtx.name)
          .then((user) => {
            userData = [user, SessionState.AUTHENTICATED];
          })
          .catch((err) => {
            userData = [null, SessionState.NONE];
            console.log(err);
          });
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
        if (error.name === 'unauthorized' || error.name === 'forbidden') {
          reject(new IncorrectCredentialsError());
        } else {
          reject(new AuthenticationError(error.message));
        }
      } else if (response) {
        updateUserData()
          .then(() => {
            resolve(true);
          })
          .catch((err) => reject(err));
      } else {
        // Something went wrong...
        reject(new AuthenticationError());
      }
    });
  });
}

/**
 * Signs up a new user who didn't exist yet and sets
 * up the right permissions for each database this
 * user should have access to.
 */
export async function signUp(name: string, email: string, password: string, role: Role): Promise<string> {
  const id: string = uuid();

  return new Promise((resolve, reject) => {
    AuthDB.signUp(email, password, {
      roles: [role],
      metadata: {
        uuid: id,
      },
    }, (error, response) => {
      if (error) {
        /**
         * The user already exists or you don't have the
         * right permissions to add him to the database.
         */
        if (error.name === 'conflict') {
          reject(new UserAlreadyExistsError());
        } else if (error.name === 'forbidden') {
          reject(new InvalidCredentialsError());
        } else {
          reject(new AuthenticationError(error.message));
        }
      } else if (response) {
        WorkersDB.put({
          _id: id,
          name,
          email,
          role,
          projects: {},
          workDoneInTime: {},
          bonus: 0,
        }).then(() => resolve(id));
      } else {
        // Something went wrong...
        reject(new AuthenticationError());
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
        reject(new NetworkError(error.message));
      } else if (response) {
        // When the logout is successfull, updateUserData should return [null, 'none']
        updateUserData().then(() => {
          resolve(true);
        });
      } else {
        // Something went wrong...
        reject(new AuthenticationError());
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

export function useUserNotNull() {
  const [_userData, setData] = useState<UserData>(userData);

  // Each component that invokes this hook will have a unique subscriberID
  const subscriberID = uuid();

  useEffect(() => {
    let timeOut: NodeJS.Timeout;
    // Setting the callback function for the new subscriber
    subscribers[subscriberID] = (newUserData: UserData) => {
      timeOut = setTimeout(() => setData(newUserData), 300);
    };

    // Update the user data only if the sessionState is still pending
    if (_userData[1] === SessionState.PENDING) {
      updateUserData();
    }

    return () => {
      delete subscribers[subscriberID];
      clearTimeout(timeOut);
    };
  }, []);

  return [userData[0], userData[1]] as [Worker, SessionState];
}
