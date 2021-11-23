import { logOut, getCurrentUser } from '.';

beforeEach(async () => {
  try {
    await logOut();
  } catch (error) {
    // This will throw an error most of the time and it's ok.
  }
});

test("Can't get logged in user wihout logging in", () => expect(getCurrentUser()).rejects.toThrow());

test("Can't log out without logging in", () => expect(logOut()).rejects.toThrow());
