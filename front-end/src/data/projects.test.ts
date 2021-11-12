import {
  addUserToProject,
  createProject, createUser, findProjectById, findUserById, ProjectID, UserID,
} from '.';

test('Can find created project', async () => {
  const id = await createProject('Test Project', 'The Flintstones', []);
  const name = findProjectById(id).then((project) => project.name);
  return expect(name).resolves.toBe('Test Project');
});

describe('addUserToProject', () => {
  let userId: UserID;
  let projectId: ProjectID;
  beforeAll(async () => {
    userId = await createUser('User 1', 'user1@watson.com', 'annotator');
    projectId = await createProject('Project 1', 'Client 1', []);
    addUserToProject(userId, projectId);
  });

  it('modifies user state', async () => expect(findUserById(userId).then((user) => user.projects[projectId]))
    .resolves.toBeDefined);

  it('modifies project state', async () => expect(findProjectById(projectId).then((project) => project.users))
    .resolves.toContain(userId));

  it('cant be done twice', async () => expect(addUserToProject(userId, projectId)).rejects.toThrow());
});
