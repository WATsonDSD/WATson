export declare type UserID = string;
export declare type Role = 'projectManager' | 'annotator' | 'verifier' | 'finance';
export declare type User = {
    id: UserID;
    projects: {
        [projectID: string]: {
            toAnnotate: ImageID[];
            toVerify: ImageID[];
            done: ImageID[];
        };
    };
    name: string;
    email: string;
    role: Role;
};
export declare type ProjectID = string;
export declare type ProjectStatus = 'inProgress' | 'done';
export declare type LandmarkSpecification = number[];
export declare type Project = {
    id: ProjectID;
    users: UserID[];
    client: string;
    startDate: Date;
    endDate: Date;
    status: ProjectStatus;
    landmarks: LandmarkSpecification;
    images: {
        toAnnotate: ImageID[];
        toVerify: ImageID[];
        done: ImageID[];
    };
};
export declare type ImageID = string;
export declare type ImageData = null;
export declare type Image = {
    id: ImageID;
    data: ImageData;
    annotation?: Annotation;
};
export declare type Point = {
    x: number;
    y: number;
    z: number;
};
export declare type Annotation = {
    [landmark: number]: Point;
};
//# sourceMappingURL=types.d.ts.map