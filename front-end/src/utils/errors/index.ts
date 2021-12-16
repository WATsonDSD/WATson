/* eslint-disable max-classes-per-file */

export class AuthenticationError extends Error {
  constructor(message: string = '') {
    super(message);
    this.name = 'Authentication Error';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class IncorrectCredentialsError extends AuthenticationError {
  constructor(message: string) {
    super(message);
    this.name = 'Incorrect Credentials';
  }
}
