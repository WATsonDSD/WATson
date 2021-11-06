import { Project, User } from '.';

/*
    Some internally consistent dummy data.
    This should enable people to start developing the logic and UI while we implement the data tier.
    ! Don't import anything from this file, import the functions you need from index.ts instead.
*/

export const Users = {
  dummyUserId: {
    id: 'dummyUserId',
    name: 'Dummy User 1',
    email: 'user1@dummy.com',
    role: 'annotator',
    projects: ['dummyProject1'],
  },
  dummyLoggedInUserId: {
    id: 'dummyLoggedInUserId',
    name: 'Dummy Logged In User',
    email: 'loggedIn@dummy.com',
    role: 'annotator',
    projects: ['dummyProject1'],
  },
} as {
    [id: string]: User,
};

export const Projects = {
  dummyProject1: {
    id: 'dummyProject1',
    users: ['dummyUserId', 'dummyLoggedInUserId'],
    client: 'Dummy Client Inc.',
    startDate: new Date(),
    endDate: new Date(),
    status: 'inProgress',
    landmarks: null,
  },
} as {
    [id: string]: Project,
};
