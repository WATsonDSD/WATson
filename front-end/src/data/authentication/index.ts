import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import { useState } from 'react';

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

  const login = (email: string, password: string, callback: VoidFunction) => Auth.login(email, password).then((data) => {
    setUser(data);
    callback();
  });

  const logout = (callback: VoidFunction) => Auth.logout().then(() => {
    setUser(null);
    callback();
  });

  const updateCurrentSession = () => Auth.updateCurrentSession().then((data) => setUser(data));

  return {
    user, login, logout, updateCurrentSession,
  };
}

// import {
//   useLocation,
//   Navigate,
// } from 'react-router-dom';

// import Auth from './auth';

// export function useAuthentication() {
//   const [user, setUser] = React.useState<any>(null);

//   const [loading, setLoading] = React.useState(true);

//   const login = (email: string, password: string, callback: Function) => Auth.login(email, password, (data) => {
//     setUser(data);
//     callback();
//   });

//   useEffect(() => {
//     updateCurrentSession().then(() => {
//       setLoading(false);
//     });
//   }, []);

//   const logout = (callback: Function) => Auth.logout(() => {
//     setUser(null);
//     callback();
//   });

//   const updateCurrentSession = () => Auth.updateCurrentSession((data) => {
//     setUser(data);
//   });

//   const value = {
//     user, login, logout, updateCurrentSession, loading,
//   };

//   return value;
// }

// export function Protected({ children }: { children: JSX.Element }) {
//   const location = useLocation();
//   const auth = useAuthentication();

//   if (auth.loading) {
//     return (<span>Loading...</span>);
//   }

//   if (!auth.user) {
//     // Redirects the user to the login page and saves the current location they were
//     // trying to access when they were redirected, which makes for nicer user experience.
//     return <Navigate to="/" state={{ from: location }} />;
//   }

//   return children;
// }
