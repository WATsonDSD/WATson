export {};
// import PouchDB from 'pouchdb';
// import PouchDBAuthentication from 'pouchdb-authentication';

// import { login, logout } from '.';

// PouchDB.plugin(PouchDBAuthentication);

// const db = new PouchDB('http://admin:admin@localhost:5984/db', { skip_setup: true });

// const validUser = {
//   email: 'valid@user.com',
//   password: 'valid',
// };

// const invalidUser = {
//   email: 'invalid@user.com',
//   password: 'invalid',
// };

// beforeAll(async () => {
//   // Injects a valid user in the database
//   await db.signUp(validUser.email, validUser.password).catch((err) => {
//     console.log(err);
//   });
// });

// afterAll(async () => {
//   // Removes injected user from the database
//   await db.deleteUser(validUser.email);
// });

// beforeEach(async () => {
//   await db.logOut();
// });

// test('User with valid credentials can login', () => expect(login(validUser.email, validUser.password)).resolves.toBeDefined());

// test('User with invalid credentials can\'t login', () => expect(login(invalidUser.email, invalidUser.password)).rejects.toBe('invalid_credentials'));

// test('User cannot logout without a valid context (a.k.a without a prior login)', () => expect(logout()).rejects.toBe('invalid_context')); // I am already signed out when this test runs. See beforeEach function.
