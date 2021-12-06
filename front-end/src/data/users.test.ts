// import axios from 'axios';
import { createUser, findUserById } from '.';

jest.mock('axios');
jest.mock('./databases');

// const MockAxios = axios as jest.Mocked<typeof axios>;

test('Can find created user', async () => {
  // MockAxios.get.mockResolvedValueOnce(true);

  const id = await createUser('Cem Cebeci', 'cem@watson.com', 'annotator');
  const name = findUserById(id).then((user) => user.name);
  return expect(name).resolves.toBe('Cem Cebeci');
});
