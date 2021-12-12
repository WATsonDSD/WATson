export type UserID = string;
export type Role = 'projectManager' | 'annotator' | 'verifier' | 'finance';
export type User = {
    id: UserID,
    projects: {
        [projectID: ProjectID]: {
            toAnnotate: ImageID[],
            waitingForAnnotation: ImageID[], // used when the annotation is rejected
            annotated:{ imageID: ImageID, date: Date}[]
            toVerify: ImageID[],
            waitingForVerification: ImageID[], // used when the annotation is rejected and annotated again and 
                                            // when the annotation is annotated for the first time and is not verified yet.
            verified: { imageID: ImageID, date: Date}[]
        }
    },
    name: string,
    email: string,
    role: Role,
};

export type ProjectID = string;
export type ProjectStatus = 'active' | 'closed'; // perhaps even more.
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
        needsAnnotatorAssignment: ImageID[],
        needsVerifierAssignment: ImageID[],
        pending: ImageID[],
        done: {imageId: ImageID, doneDate: Date}[],
    }}

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

export type RejectedAnnotation = {
    imageID: ImageID,
    comment: String,
    wrongAnnonation: Annotation,
}
