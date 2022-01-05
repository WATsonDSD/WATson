/**
 * This type assumes that each document
 * in the database  will have at most
 * one attachment called 'asset'.
 */
type DBAttachment = {
    image?: {
        // eslint-disable-next-line camelcase
        content_type: string,
        data: Blob,
    }
};

/**
 * This type is meant to extend most of the other
 * types declared in this file. This will make the
 * code for document reads and writes much simpler.
 */
export type DBDocument<DocumentType> = {
    _id: string,
    _rev: string,
    _attachments?: DBAttachment,
} & DocumentType;

export type UserID = string;
export type BlockID = string;
export type ImageID = string;
export type ReportID = string;
export type ProjectID = string;

export type Role = 'projectManager' | 'annotator' | 'verifier' | 'finance';

export type TimedWork<Work> = {
    [year: string]: {
        [month: string]: {
            [day: string]: Work,
        },
    },
};

export type User = {
    role: Role,
    name: string,
    uuid: string,
    email: string,

    projects: {
        [projectID: ProjectID]: {
            assignedAnnotations: ImageID[],
            rejectedAnnotations: ImageID[],
            assignedVerifications: ImageID[],
            pendingVerifications: ImageID[],

            annotated: { imageID: ImageID, date: Date}[],
            verified: { imageID: ImageID, date: Date}[],
        },
    },

    timedWork: TimedWork<{
        [projectId: ProjectID]: {
            annotated: ImageID[],
            verified: ImageID[],
        }
    }>,
};

export type Block = {
    _id: BlockID,

    projectID: ProjectID,
    verifierID?: UserID,
    annotatorID?: UserID,

    size: number,
    assignedAnnotations: ImageID[],
    assignedVerifications: ImageID[],
};

export type Landmark = number;

export type ProjectStatus = 'pending' | 'active' | 'closed';

export type Project = {
    name: string,
    client: string,
    startDate: Date,
    endDate: Date,
    status: ProjectStatus,

    landmarks: Landmark[],

    pricePerImageAnnotation: number,
    pricePerImageVerification: number,
    hourlyRateAnnotation: number,
    hourlyRateVerification: number,

    workers: UserID[],

    linkedWorkers: {
        annotatorID: UserID,
        verifierID: UserID,
    }[],

    timedWork: TimedWork<{
        imageID: ImageID,
        annotator: UserID,
        verifier: UserID,
    }[]>

    images: {
        blocks: {
            [blockID: BlockID]: Block,
        },
        pendingAssignments: ImageID[],
        done: { imageID: ImageID, doneDate: Date }[],
    }
};

export type ImageData = Blob;

export type Point = {
    x: number,
    y: number,
    z: number,
};

export type Annotation = {
    [landmark: Landmark]: Point,
};

export type Image = {
    blockID?: BlockID,
    verifierID?: UserID,
    annotatorID?: UserID,
    annotation?: Annotation,

    _attachments: DBAttachment,
};

export type Rejection = {
    imageID: ImageID,
    annotatorID: UserID,

    comment: String,
    rejectedAnnonation: Annotation,
};

export type Report = {
    date: Date,
    rows: {
        role: Role,
        name: string,
        email: string,
        userID: UserID,
        projectName: string,
        client: string,
        hours: number,
        earnings: number,
    }[]
};
