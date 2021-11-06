export type UserID = string;
export type Role = "projectManager" | "annotator" | "verifier" | "finance";
export type User = {
    id: UserID,
    projects: ProjectID[],
    name: string,
    email: string,
    role: Role,
};

export type ProjectID = string;
export type ProjectStatus = "inProgress" | "done"; // perhaps even more.
export type LandmarkSpecification = null; //! I don't know what this looks like yet.
export type Project = {
    id: ProjectID,
    users: UserID[],
    client: string,
    startDate: Date,
    endDate: Date,
    status: ProjectStatus,
    landmarks: LandmarkSpecification,
}