import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';

import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

PouchDB.plugin(PouchDBAuthentication);

// TYPE DEFINITIONS
type UserContext = PouchDB.Authentication.UserContext | null;
type Subscribers = {[id: string]: (context: UserContext) => void};

/**
 * Because of a design flaw in pouchdb-authentication, we need to attach
 * our db instance to a dummy database - in this case "/db".
 * (https://stackoverflow.com/questions/30028575/pouchdb-authentication-create-new-couchdb-users)
 */
const db = new PouchDB('http://localhost:5984/db', { skip_setup: true });

let currentContext : UserContext = null;
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
        reject(err);
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
        reject(err);
      } else {
        updateCurrentContext()
          .then(() => {
            resolve(response);
          });
      }
    });
  });
}

/**
 * Ends the current user session and deletes the session cookie from the browser.
 * Any request should be denied from here on forward.
 */
export async function logout(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.logOut((err) => {
      if (err) {
        reject(err);
      } else {
        updateCurrentContext()
          .then(() => {
            resolve();
          });
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
