import { findUserById, User } from ".";

let loggedIn = false; // temporary flag to enforce the user to log in before retrieving login related data.

/**
 * Authenticates the system to access or modify data.
 * @returns the success of the login operation.
 */
export async function logIn(username: string, password: string): Promise<boolean> {
    loggedIn = true;
    console.log(`Trying to log in with username: ${username} and password: ${password} \n
        but it's not implemented yet.`);
    return true;
}

/**
 * Ends the current session, data access will be blocked until a future `logIn` call.
 * @returns the success of the logout operation.
 */
export async function logOut(): Promise<boolean> {
    loggedIn = false;
    console.log(`Trying to log out but it's not implemented yet.`);
    return true;
}

/**
 * Returns information about the currently authorized user.
 */
export async function getLoggedInUser(): Promise<User> {
    if (!loggedIn)
        throw Error('You need to call logIn before calling this function!');
    console.log(`Returning dummy logged in user`);
    return findUserById('dummyLoggedInUserId');
}
