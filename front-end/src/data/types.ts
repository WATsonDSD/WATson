export type YearMonthDay<T> = { [year: string]: { [month: string]: { [day: string]: T } } };
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
        },
    },
    workDoneInTime: YearMonthDay <{
        [projectId: ProjectID]: {
            annotated: ImageID[],
            verified: ImageID[],
        }
    }>
    name: string,
    email: string,
    role: Role,
};

export type BlockID = string;
export type Block = {
    blockId: BlockID,
    toAnnotate: ImageID[],
    toVerify: ImageID[],
    idAnnotator: UserID | undefined,
    idVerifier: UserID | undefined,
    projectId: ProjectID,
}

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
    hourlyRateVerification: number,
    annVer: { annotatorId: UserID, verifierId: UserID}[],

    workDoneInTime: YearMonthDay <{
        imageId: ImageID,
        annotator: UserID,
        verifier: UserID,
    }[]>

    images: {
        blocks: { // block of images instanziated by the annotator
            [blockID: BlockID]: {
                block: Block
            }}
        imagesWithoutAnnotator: ImageID[], // images that doesn't have annotator : ALL THE IMAGES
        done: {imageId: ImageID, doneDate: Date}[],
    }};

export type ImageID = string;

export type ImageData = Blob;

export type Image = {
    id: ImageID,
    blockId?: BlockID
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
    annotatorID: UserID,
    wrongAnnonation: Annotation,
}
export type ReportID = string;
export type Report = {
    reportID: ReportID,
    date: Date,
    reportRow: {user: UserID, name: string, email: string, role: Role, projectName: string, hours: number, payment: number, client: string }[]
}
