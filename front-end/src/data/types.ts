export type UserID = string;
export type Role = "projectManager" | "annotator" | "verifier" | "finance";
export type User = {
    id: UserID,
    projects: {
        id: ProjectID,
        toAnnotate: ImageID[],
        toVerify: AnnotatedImage[],
    }[],
    name: string,
    email: string,
    role: Role,
};

export type ProjectID = string;
export type ProjectStatus = "inProgress" | "done"; // perhaps even more.
export type LandmarkSpecification = number[];
export type Project = {
    id: ProjectID,
    users: UserID[],
    client: string,
    startDate: Date,
    endDate: Date,
    status: ProjectStatus,
    landmarks: LandmarkSpecification,
    
    images : {
        toBeAnnotated: ImageID[],
        toBeVerified: AnnotatedImage[],
        done: AnnotatedImage[],
    }
}

export type ImageID = string;
export type ImageData = null; //TODO decide on a format for images.
export type Image = {
    id: ImageID,
    data: ImageData,
}

export type AnnotationID = string;
export type Point = {x: number, y: number, z: number}
export type Annotation = {
    id: AnnotationID,
    [landmark: number] : Point
}

export type AnnotatedImage = {
    image: ImageID,
    annotation: AnnotationID,
}