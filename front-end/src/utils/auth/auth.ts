/**
 * This represents some generic auth provider API, like Firebase.
 * ! This needs to be implemented
 */
const Auth = {
  isAuthenticated: false,
  signin(callback: Function) {
    Auth.isAuthenticated = true;
    setTimeout(callback, 100);
  },
  signout(callback: Function) {
    Auth.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export default Auth;
