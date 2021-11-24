/**
 * ! This still needs an actual implementation
 */
const Auth = {
  isAuthenticated: false,
  async login(callback: Function) {
    Auth.isAuthenticated = true;
    setTimeout(callback, 2000);
  },
  async logout(callback: Function) {
    Auth.isAuthenticated = false;
    setTimeout(callback, 2000);
  },
};

export default Auth;
