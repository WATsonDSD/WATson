export type UserID = string;
export type Role = 'projectManager' | 'annotator' | 'verifier' | 'finance';
export type User = {
    id: UserID,
    projects: {
        [projectID: ProjectID]: {
            toAnnotate: ImageID[],
            toVerify: ImageID[],
            done: ImageID[],
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
    pricePerImageAnnotation: number,
    pricePerImageVerification: number,
    hourlyRateAnnotation: number,
    hourlyRateVerification: number

    images: {
        toAnnotate: {imageId: ImageID, annotator: UserID | null}[],
        toVerify: {imageId: ImageID, annotator: UserID | null, verifier: UserID | null}[],
        done: {imageId: ImageID, annotator: UserID | null, verifier: UserID | null}[],
    }
}

export type ImageID = string;

export type ImageData = Blob;

export type Image = {
    id: ImageID,
    data?: ImageData,
    annotation?: Annotation
}

export type Point = { x: number, y: number, z: number }
export type Annotation = {
    [landmark: number]: Point
}
