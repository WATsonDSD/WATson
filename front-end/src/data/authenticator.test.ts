import {logOut, getLoggedInUser} from './authenticator';

beforeEach( async () => {
    try { 
        await logOut();
    } catch (error) {
        // This will throw an error most of the time and it's ok.
    } 
});

test( "Can't get logged in user wihout logging in", () => {
    return expect(getLoggedInUser()).rejects.toThrow();
});

test( "Can't log out without logging in", () => {
    return expect(logOut()).rejects.toThrow();
});

