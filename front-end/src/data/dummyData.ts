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
      dummyProject2: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
      dummyProject3: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
    },
  },
  dummyLoggedInVUserId: {
    id: 'dummyLoggedInUserId',
    name: 'Dummy Logged In User',
    email: 'loggedIn@dummy.com',
    role: 'verifier',
    projects: {
      dummyProject1: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
      dummyProject2: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
      dummyProject3: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
    },
  },
  dummyLoggedInFUserId: {
    id: 'dummyLoggedInUserId',
    name: 'Dummy Logged In User',
    email: 'loggedIn@dummy.com',
    role: 'finance',
    projects: {
      dummyProject1: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
      dummyProject2: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
      dummyProject3: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
    },
  },
  dummyLoggedInPMUserId: {
    id: 'dummyLoggedInUserId',
    name: 'Dummy Logged In User',
    email: 'loggedIn@dummy.com',
    role: 'projectManager',
    projects: {
      dummyProject1: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
      dummyProject2: {
        toAnnotate: ['image1'],
        toVerify: [],
        done: ['image2'],
      },
      dummyProject3: {
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
    client: 'Dummy Client Inc.',
    startDate: new Date(),
    endDate: new Date(),
    status: 'inProgress',
    landmarks: [0],
    images: {
      toAnnotate: ['image1'],
      toVerify: ['image2'],
      done: [],
    },
  },
  dummyProject2: {
    id: 'dummyProject2',
    users: ['dummyUserId', 'dummyLoggedInUserId', 'dummyLoggedInVUserId', 'dummyLoggedInPMUserId'],
    client: 'Dummy Client Inc.',
    startDate: new Date(),
    endDate: new Date(),
    status: 'inProgress',
    landmarks: [0],
    images: {
      toAnnotate: ['image1'],
      toVerify: ['image2'],
      done: [],
    },
  },
  dummyProject3: {
    id: 'dummyProject3',
    users: ['dummyUserId', 'dummyLoggedInUserId', 'dummyLoggedInVUserId', 'dummyLoggedInPMUserId'],
    client: 'Dummy Client Inc.',
    startDate: new Date(),
    endDate: new Date(),
    status: 'inProgress',
    landmarks: [0],
    images: {
      toAnnotate: ['image1'],
      toVerify: ['image2'],
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
