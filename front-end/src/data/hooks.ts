import { useEffect, useState } from 'react';
import { Project, User } from './types';
import {
  getLoggedInUser, getProjectsOfUser, logIn,
} from '.';

export function useLoggedInUser(): User | null {
  const [user, setUser] = useState<User| null>(null);

  useEffect(() => {
    logIn('TestUser', 'password123');
    getLoggedInUser()
      .then((loggedInUser) => setUser(loggedInUser));
  }, []);

  return user;
}

export function useUserProjects(user: User): Project[] | null {
  const [projects, setUserProjects] = useState<Project[]| null>(null);

  useEffect(() => {
    getProjectsOfUser(user)
      .then((userProjects) => setUserProjects(userProjects));
  }, []);

  return projects;
}
