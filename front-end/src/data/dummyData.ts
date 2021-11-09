import { Project, User, Image, Annotation } from ".";

/*
    Some internally consistent dummy data.
    This should enable people to start developing the logic and UI while we implement the data tier.
    ! Don't import anything from this file, import the functions you need from index.ts instead.
*/

export const Users = {
    'dummyUserId': {
        id: 'dummyUserId',
        name: 'Dummy User 1',
        email: 'user1@dummy.com',
        role: 'annotator',
        projects: [
            {
                id: 'dummyProject1',
                toAnnotate: [],
                toVerify: [],
            },
        ],
    },
    'dummyLoggedInUserId': {
        id: 'dummyLoggedInUserId',
        name: 'Dummy Logged In User',
        email: 'loggedIn@dummy.com',
        role: 'annotator',
        projects: [
            {
                id: 'dummyProject1',
                toAnnotate: [],
                toVerify: [],
            },
        ],
    } 
} as {
    [id: string]: User,
};

export const Projects = {
    'dummyProject1' : {
        id: 'dummyProject1',
        users: ['dummyUserId', 'dummyLoggedInUserId'],
        client: 'Dummy Client Inc.',
        startDate: new Date(),
        endDate: new Date(),
        status: 'inProgress',
        landmarks: [0],
        images: {
            toBeAnnotated: ['image1'],
            toBeVerified: [ {image: 'image2', annotation: 'annotation2'}],
            done: [],
        }
    }
} as {
    [id: string]: Project,
};

export const Images = {
    'image1' : {
        id: 'image1',
        data: null,
    },
    'image2' : {
        id: 'image1',
        data: null,
    },
} as {
    [id: string]: Image,
};

export const Annotations = {
    'annotation2' : {
        id: 'annotation2',
        0 : {x: 1, y: 2, z: 3}
    }
} as {
    [id: string]: Annotation,
};