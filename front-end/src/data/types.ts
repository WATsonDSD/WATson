export type UserID = string;
export type Role = 'projectManager' | 'annotator' | 'verifier' | 'finance';
export type User = {
    id: UserID,
    projects: {
        [projectID: ProjectID]: {
            toAnnotate: ImageID[],
            waitingForAnnotation: ImageID[], // used when the annotation is rejected
            annotated: ImageID[],
            toVerify: ImageID[],
            waitingForVerification: ImageID[], // used when the annotation is rejected and annotated again
            verified: ImageID[],
        }
    },
    name: string,
    email: string,
    role: Role,
};

export type ProjectID = string;
export type ProjectStatus = 'inProgress' | 'done'; // perhaps even more.
export type LandmarkSpecification = number[];
export type Project = {
    id: ProjectID,
    users: UserID[],
    name: string,
    client: string,
    startDate: string,
    endDate: string,
    status: ProjectStatus,
    landmarks: LandmarkSpecification,

    images: {
        toAnnotate: {imageId: ImageID }[],
        toVerify: {imageId: ImageID }[],
        done: {imageId: ImageID, annotator: UserID | null, verifier: UserID | null}[],
    }
}

export type ImageID = string;

export type ImageData = Blob;

export type Image = {
    id: ImageID,
    data?: ImageData,
    annotation?: Annotation,
    idAnnotator?: UserID,
    idVerifier?: UserID
}

export type Point = { x: number, y: number, z: number }
export type Annotation = {
    [landmark: number]: Point
}

export type RejectionID = string;
export type RejectedAnnotation = {
    imageID: ImageID,
    comment: String,
    wrongAnnonation: Annotation,
}
