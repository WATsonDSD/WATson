import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';

import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import {
  findUserById, Role, User, UserID,
} from '.';

PouchDB.plugin(PouchDBAuthentication);

// TYPE DEFINITIONS
type SessionState = User | 'isLoading' | null;
type Subscribers = {[id: string]: (user: SessionState) => void};

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

let sessionState : SessionState = 'isLoading';
const sessionSubscribers : Subscribers = {};

function notifySubscribers(context: SessionState) {
  Object.values(sessionSubscribers).forEach((updateSubscriberContext) => updateSubscriberContext(context));
}

/**
 * Updates the current user context to the match the one in the cookies (if any).
 * It's necessary to restore the user information when the application is reloaded
 * in the browser while a valid user session is still present.
 */
async function updateSessionState(): Promise<SessionState> {
  return new Promise((resolve, reject) => {
    db.getSession((err, response) => {
      console.log(err, response);
      if (err) {
        reject(err.name);
      } else if (!response?.userCtx.name) {
        sessionState = null;
        notifySubscribers(null);
      } else {
        UserCtxToUser(response.userCtx).then((val) => resolve(val));
      }
    });
  });
}

async function UserCtxToUser(userCtx: PouchDB.Authentication.UserContext): Promise<SessionState> {
  const user = await findUserById(userCtx.roles![1]);
  sessionState = user;
  notifySubscribers(user);
  return user;
  // return new Promise((resolve) => {
  //   db.getUser(userCtx.name, (e, r) => {
  //     if (e) {
  //       if (e.name === 'not_found') {
  //         // typo, or you don't have the privileges to see this user
  //       } else {
  //         // some other error
  //       }
  //     } else {
  //       //! this is where we can screw up
  //       findUserById((r as any).id).then((user) => {
  //         sessionState = user;
  //         notifySubscribers(user);
  //         resolve(user);
  //       });
  //     }
  //   });
  // });
}

/**
 * Authenticates the user and creates a session cookie that will be used
 * to validate following requests to the database.
 */
export async function logIn(email: string, password: string): Promise<SessionState> {
  return new Promise((resolve, reject) => {
    db.logIn(email, password, (err) => {
      if (err) {
        if (err.name === 'unauthorized' || err.name === 'forbidden') {
          reject(new AuthenticationError(Errors.InvalidCredentials).name);
        }
        reject(err.name);
      }
      updateSessionState()
        .then((res) => {
          resolve(res);
        });
    });
  });
}

/**
 * Signs up a new user who didn't exist yet.
 */
export async function signUp(email: string, password: string, role: Role, id: UserID): Promise<void> {
  return new Promise((resolve, reject) => {
    db.signUp(email, password, {
      roles: [role, id],
    }, (err, response) => {
      if (err) {
        reject(err.name);
      }
      if (response) {
        resolve();
      }
      reject();
    });
  });
}

/**
 * Ends the current user session and deletes the session cookie from the browser.
 * Any request should be denied from here on forward.
 */
export async function logOut(): Promise<void> {
  return new Promise((resolve, reject) => {
    // A valid user needs to be signed in
    if (sessionState === null) {
      reject(new AuthenticationError(Errors.InvalidContext).name);
    }

    db.logOut((err) => {
      if (err) {
        reject(err.name);
      } else {
        updateSessionState()
          .then(() => {
            resolve();
          });
      }
    });
  });
}

export function useUserContext(): SessionState {
  const [context, setContext] = useState<SessionState>(sessionState);

  useEffect(() => {
    const id : string = uuid();

    sessionSubscribers[id] = (updatedContext: SessionState) => setContext(updatedContext);
    updateSessionState();

    return () => {
      delete sessionSubscribers[id];
    };
  }, []);

  return context;
}
