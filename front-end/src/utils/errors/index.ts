/* eslint-disable max-classes-per-file */

export class NetworkError extends Error {
  constructor(message: string = 'Something went wrong...please check your connection.') {
    super(message);
    this.name = 'Network error';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class FetchingError extends NetworkError {
  constructor(message: string = 'Something went wrong...we could not fetch the requested data.') {
    super(message);
    this.name = 'Fetching error';
  }
}

export class UserNotFoundError extends FetchingError {
  constructor(message: string = 'We could not fetch the requested user data.') {
    super(message);
    this.name = 'User not found';
  }
}

export class UpdateError extends NetworkError {
  constructor(message: string = 'Something went wrong...we could not complete your update request.') {
    super(message);
    this.name = 'Update error';
  }
}

export class UpdateUserError extends UpdateError {
  constructor(message: string = 'We could not update the user information as requested.') {
    super(message);
    this.name = 'Failed to update user';
  }
}

export class UploadError extends NetworkError {
  constructor(message: string = 'Something went wrong...we could not complete your upload request.') {
    super(message);
    this.name = 'Upload error';
  }
}

export class CreateUserError extends UploadError {
  constructor(message: string = 'Something went wrong while trying to add the user to the application.') {
    super(message);
    this.name = 'Failed to create user';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Something went wrong...please try again after some time.') {
    super(message);
    this.name = 'Authentication error';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class IncorrectCredentialsError extends AuthenticationError {
  constructor(message: string = 'The email and/or password do not correspond to a valid user.') {
    super(message);
    this.name = 'Incorrect credentials';
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor(message: string = 'The email provided is not valid.') {
    super(message);
    this.name = 'Invalid credentials';
  }
}

export class UserAlreadyExistsError extends AuthenticationError {
  constructor(message: string = 'The provided credentials correspond to an already existing user.') {
    super(message);
    this.name = 'Conflict';
  }
}
