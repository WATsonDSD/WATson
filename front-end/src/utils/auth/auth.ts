/**
 * ! This still needs an actual implementation
 */
const Auth = {
  isAuthenticated: false,
  signin(callback: Function) {
    Auth.isAuthenticated = true;
    setTimeout(callback, 2000);
  },
  signout(callback: Function) {
    Auth.isAuthenticated = false;
    setTimeout(callback, 2000);
  },
};

export default Auth;
