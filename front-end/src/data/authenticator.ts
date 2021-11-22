import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';
import { findUserById, User } from '.';
import { usersDB } from './databases';

PouchDB.plugin(PouchDBAuthentication);

// temporary flag to enforce the user to log in before retrieving login related data.
const isLoggedIn = false;

/**
 * Authenticates the system to access or modify data.
 * @returns the success of the login operation.
 */
export async function logIn(email: string, password: string): Promise<boolean> {
  // ! It's not clear why pouhdb authentication requires a specific database attached to it
  usersDB.logIn(email, password, (err) => {
    if (err) {
      if (err.name === 'unauthorized' || err.name === 'forbidden') {
      // name or password incorrect
      } else {
        // everything went smoothly!
        // when isLoggedIn becomes true i want to be rerouted to my dashboard
        // isLoggedIn = true;
      }
    }
  });
  return isLoggedIn;
}

/**
 * Ends the current session, data access will be blocked until a future `logIn` call.
 * @returns the success of the logout operation.
 */
export async function logOut(): Promise<boolean> {
  if (!isLoggedIn) throw Error('You need to call logIn before calling this function!');
  usersDB.logOut((err) => {
    if (err) {
      // network error
    } else {
      // set isLoggedIn to false again
    }
  });
  return !isLoggedIn;
}

/**
 * Returns information about the currently authorized user.
 */
export async function getCurrentUser(): Promise<User> {
  if (!isLoggedIn) throw Error('You need to call logIn before calling this function!');
  usersDB.getSession((err, response) => {
    if (err) {
      // network error
    } else if (!response?.userCtx.name) {
      // nobody's logged in
    } else {
      // response.userCtx.name is the current user
      console.log(response.userCtx);
    }
  });
  console.log('Returning dummy logged in user');
  return findUserById('dummyisLoggedInUserId');
}
