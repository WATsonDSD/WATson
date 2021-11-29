import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';

import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import { Role, UserID } from '.';

PouchDB.plugin(PouchDBAuthentication);

// TYPE DEFINITIONS
type UserContext = PouchDB.Authentication.UserContext | 'isLoading' | null;
type Subscribers = {[id: string]: (context: UserContext) => void};

// ERROR DEFINITIONS
const Errors: {[type: string]: { name: string, message: string}} = {
  InvalidCredentials: {
    name: 'invalid_credentials',
    message: 'Authentication credentials are not valid.',
  },
  InvalidContext: {
    name: 'invalid_context',
    message: 'No valid user context available.',
  },
};

/* eslint-disable lines-between-class-members */
class AuthenticationError extends Error {
  name: string = '';
  message: string = '';

  constructor(error: { name: string, message: string}, ...args: any[]) {
    super(...args);

    this.name = error.name;
    this.message = error.message;

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Because of a design flaw in pouchdb-authentication, we need to attach
 * our db instance to a dummy database - in this case "/db".
 * (https://stackoverflow.com/questions/30028575/pouchdb-authentication-create-new-couchdb-users)
 */
const db = new PouchDB('http://localhost:5984/db', { skip_setup: true });
const dbAsAdmin = new PouchDB('http://admin:admin@localhost:5984/db', { skip_setup: true }); // ! In the future a call will be made to the backend

let currentContext : UserContext = 'isLoading';
const contextSubscribers : Subscribers = {};

function notifySubscribers(context: UserContext) {
  Object.values(contextSubscribers).forEach((updateSubscriberContext) => updateSubscriberContext(context));
}

/**
 * Updates the current user context to the match the one in the cookies (if any).
 * It's necessary to restore the user information when the application is reloaded
 * in the browser while a valid user session is still present.
 */
async function updateCurrentContext(): Promise<UserContext> {
  return new Promise((resolve, reject) => {
    db.getSession((err, response) => {
      if (err) {
        reject(err.name);
      } else if (!response?.userCtx.name) {
        currentContext = null;
      } else {
        currentContext = response.userCtx;
      }
      notifySubscribers(currentContext);
      resolve(currentContext);
    });
  });
}

/**
 * Authenticates the user and creates a session cookie that will be used
 * to validate following requests to the database.
 */
export async function login(email: string, password: string): Promise<UserContext> {
  return new Promise((resolve, reject) => {
    db.logIn(email, password, (err, response) => {
      if (err) {
        if (err.name === 'unauthorized' || err.name === 'forbidden') {
          reject(new AuthenticationError(Errors.InvalidCredentials).name);
        }
        reject(err.name);
      }
      updateCurrentContext()
        .then(() => {
          resolve(response);
        });
    });
  });
}

/**
 * Signs up a new user who didn't exist yet.
 */
export async function signup(name: string, email: string, password: string, role: Role): Promise<UserID> {
  return new Promise((resolve, reject) => {
    dbAsAdmin.signUp(email, password, {
      roles: [role],
      metadata: {
        fullname: name,
        projects: {},
      },
    }, (err, response) => {
      if (err) {
        reject(err.name);
      }
      if (response) {
        resolve(response.id);
      }
      reject();
    });
  });
}

/**
 * Ends the current user session and deletes the session cookie from the browser.
 * Any request should be denied from here on forward.
 */
export async function logout(): Promise<void> {
  return new Promise((resolve, reject) => {
    // A valid user needs to be signed in
    if (currentContext === null) {
      reject(new AuthenticationError(Errors.InvalidContext).name);
    }

    db.logOut((err) => {
      if (err) {
        reject(err.name);
      } else {
        updateCurrentContext()
          .then(() => {
            resolve();
          });
      }
    });
  });
}

/* eslint-disable no-underscore-dangle */
export async function getUser(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    dbAsAdmin.getUser(email, (err, response) => {
      if (err) {
        reject(err.name);
      }
      if (response) {
        // const user = {
        //   id: response._id,
        //   name: response.,
        //   role: response.roles ? response.roles[0] : '',
        // } as User;

        resolve(response);
      }
    });
  });
}

export function useUserContext(): UserContext | 'isLoading' {
  const [context, setContext] = useState<UserContext>(currentContext);

  useEffect(() => {
    const id : string = uuid();

    contextSubscribers[id] = (updatedContext: UserContext) => setContext(updatedContext);
    updateCurrentContext();

    return () => {
      delete contextSubscribers[id];
    };
  }, []);

  return context;
}
