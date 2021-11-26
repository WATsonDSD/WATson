import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import { useState, useEffect } from 'react';

PouchDB.plugin(PouchDBAuthentication);

/**
 * Because of a design flaw in pouchdb-authentication, we need to attach
 * our db instance to a dummy database - in this case "/db".
 * (https://stackoverflow.com/questions/30028575/pouchdb-authentication-create-new-couchdb-users)
 */
const db = new PouchDB('http://admin:admin@localhost:5984/db', { skip_setup: true });

const Auth = {
  // Authenticates the user.
  async login(email: string, password: string): Promise<PouchDB.Authentication.LoginResponse | null> {
    return new Promise((resolve, reject) => {
      db.logIn(email, password, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },
  // Ends current user session.
  async logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.logOut((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
  // Returns information about the currently authorized user.
  async updateCurrentSession(): Promise<PouchDB.Authentication.UserContext | null> {
    return new Promise((resolve, reject) => {
      db.getSession((err, response) => {
        if (err) {
          reject(err);
        } else if (!response?.userCtx.name) {
          resolve(null);
        } else {
          resolve(response.userCtx);
        }
      });
    });
  },
};

export default function useAuthentication() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, updateLoadingStatus] = useState<boolean>(true);

  const login = (email: string, password: string, callback: VoidFunction) => Auth.login(email, password).then((data) => {
    setUser(data);
    callback();
  });

  const logout = (callback: VoidFunction) => Auth.logout().then(() => {
    setUser(null);
    callback();
  });

  const updateCurrentSession = () => Auth.updateCurrentSession().then((data) => {
    setUser(data);
  });

  useEffect(() => {
    updateCurrentSession().then(() => updateLoadingStatus(false));
  }, []);

  return {
    user, login, logout, updateCurrentSession, isLoading,
  };
}
