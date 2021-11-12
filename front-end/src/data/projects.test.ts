import { createProject, findProjectById } from '.';

test('Can find created project', async () => {
  const id = await createProject('Test Project', 'The Flintstones', []);
  const name = findProjectById(id).then((project) => project.name);
  return expect(name).resolves.toBe('Test Project');
});
