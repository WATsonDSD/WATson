import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';
// import { useEffect, useState } from 'react';

PouchDB.plugin(PouchDBAuthentication);

/**
 * Because of a design flaw in pouchdb-authentication, we need to attach
 * our db instance to a dummy database - in this case "/db".
 * (https://stackoverflow.com/questions/30028575/pouchdb-authentication-create-new-couchdb-users)
 */
// const db = new PouchDB('http://localhost:5984/db', { skip_setup: true });

// let currentSession: PouchDB.Authentication.UserContext | null = null;
// const currentSessionSubscribers = {} as {[id:string] : Function};
// /**
//  * Authenticates the user.
//  */
// export async function login(email: string, password: string): Promise<PouchDB.Authentication.LoginResponse | null> {
//   return new Promise((resolve, reject) => {
//     db.logIn(email, password, (err, response) => {
//       if (err) {
//         reject(err);
//       } else {
//         updateCurrentSession();
//         resolve(response);
//       }
//     });
//   });
// }

// // Ends current user session.
// export async function logout(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     db.logOut((err) => {
//       if (err) {
//         reject(err);
//       } else {
//         updateCurrentSession();
//         resolve();
//       }
//     });
//   });
// }

// /**
//  * Returns information about the currently authorized user.
//  */
// async function updateCurrentSession(): Promise<PouchDB.Authentication.UserContext | null> {
//   return new Promise((resolve, reject) => {
//     db.getSession((err, response) => {
//       if (err) {
//         reject(err);
//       } else if (!response?.userCtx.name) {
//         notifySubscribers(null);
//         resolve(null);
//       } else {
//         currentSession = response.userCtx;
//         notifySubscribers(response.userCtx);
//         resolve(response.userCtx);
//       }
//     });
//   });
// }

// function notifySubscribers(value: PouchDB.Authentication.UserContext | null) {
//   Object.values(currentSessionSubscribers).forEach((callback) => callback(value));
// }

// export function useAuth(): PouchDB.Authentication.UserContext | null {
//   const [result, setResult] = useState(currentSession);

//   useEffect(() => {
//     const id = new Date().toISOString();
//     currentSessionSubscribers[id] = (newValue: PouchDB.Authentication.UserContext) => { setResult(newValue); };
//     updateCurrentSession();
//     return () => { delete currentSessionSubscribers[id]; };
//   }, []);

//   return result;
// }
