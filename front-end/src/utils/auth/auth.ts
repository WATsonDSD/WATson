import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

// import { User } from '../../data';

PouchDB.plugin(PouchDBAuthentication);

/**
 * Because of a design flaw in pouchdb-authentication, we need to attach
 * our db instance to a dummy database - in this case "/db".
 * (https://stackoverflow.com/questions/30028575/pouchdb-authentication-create-new-couchdb-users)
 */
const db = new PouchDB('http://admin:admin@localhost:5984/db', { skip_setup: true });

const Auth = {
  // Authenticates the user.
  login(email: string, password: string, callback: (data: any) => void) {
    db.logIn(email, password, (err, response) => {
      if (err) {
        if (err.name === 'unauthorized' || err.name === 'forbidden') {
          // TODO: Show error message: name or password incorrent
        }
      } else {
        callback(response);
      }
    });
  },
  // Ends the user session.
  logout(callback: VoidFunction) {
    // TODO: (?) check if user is authenticated before calling this function
    db.logOut((err) => {
      if (err) {
        // TODO: Show the network error message
      } else {
        callback();
      }
    });
  },
  // Retrieves current user's session
  updateCurrentSession(callback: (data: any) => void) {
    db.getSession((err, response) => {
      if (err) {
        // TODO: Show the network error message
      } else if (!response?.userCtx.name) {
        // TODO: Show error message: nobody is logged in
        callback(null);
      } else {
        // TODO: Pass user info back to parent function
        callback(response.userCtx);
      }
    });
  },
};

export default Auth;
