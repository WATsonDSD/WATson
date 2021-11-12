import { useEffect, useState } from 'react';
import { getLoggedInUser, User } from '.';

export default () => {
  const [user, setUser] = useState<User| null>(null);

  useEffect(() => {
    getLoggedInUser()
      .then((loggedInUser) => setUser(loggedInUser));
  }, []);

  return user;
};
