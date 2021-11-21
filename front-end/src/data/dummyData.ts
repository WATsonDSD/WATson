import { Project, User, Image } from '.';

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
    projects: {
      dummyProject1: {
        toAnnotate: [],
        toVerify: ['image2'],
        done: [],
      },
    },
  },
  dummyLoggedInUserId: {
    id: 'dummyLoggedInUserId',
    name: 'Dummy Logged In User',
    email: 'loggedIn@dummy.com',
    role: 'annotator',
    projects: {
      dummyProject1: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
    },
  },

} as {
    [id: string]: User,
};

export const Projects = {
  dummyProject1: {
    id: 'dummyProject1',
    users: ['dummyUserId', 'dummyLoggedInUserId', 'dummyLoggedInVUserId', 'dummyLoggedInPMUserId'],
    name: 'Dummy Project .',
    client: 'Dummy Client Inc.',
    startDate: new Date().toJSON(),
    endDate: '',
    status: 'inProgress',
    landmarks: [0],
    images: {
      toAnnotate: [{ imageId: 'image1', annotator: 'dummyLoggedInUserId' }],
      toVerify: [{ imageId: 'image2', annotator: 'dummyLoggedInUserId', verifier: 'dummyUserId' }],
      done: [],
    },
  },
} as {
    [id: string]: Project,
};

export const Images = {
  image1: {
    id: 'image1',
    data: null,
  },
  image2: {
    id: 'image2',
    data: null,
    annotation: {
      0: { x: 1, y: 2, z: 3 },
    },
  },
} as {
    [id: string]: Image,
};
