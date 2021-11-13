import { createUser, findUserById } from '.';

test('Can find created user', async () => {
  const id = await createUser('Cem Cebeci', 'cem@watson.com', 'annotator');
  const name = findUserById(id).then((user) => user.name);
  return expect(name).resolves.toBe('Cem Cebeci');
});
