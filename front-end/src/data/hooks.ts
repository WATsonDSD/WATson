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

/*
    We can use this as a general purpose hook for now.

    The idea is to abstract 'fetching data' as a generic operation.
    For example, `useUserProjects(user1)` is equivalent to `useData(() => getProjectsOfUser(user1))`
    Or `useLoggedInUser()` is equivalent to `useData(() => {logIn(...); return getLoggedInUser })`

    The main promise of using hooks is that the data returned by them change reactively.
    Meaning that if the database includes a new project for a user, the value returned by
        `useUserProjects` changes and the component using it re-renders automatically.
    These hooks change only once for now, from `null` to whatever the async function returns.
    Once we have a real database, I'll try to write better actually reactive hooks.
 */

/**
 * A hook used to make working with async functions easier.  
 * The hook returns `null` while waiting for `accessor`
 *  to resolve and returns the result after that.
 * @example
 * // To pass a parameter, use a wrapper function.
 * useData( () => findUserById(id1))
 */
export function useData<T>(accessor: () => Promise<T>) {
  const [data, setData] = useState<T| null>(null);

  useEffect(() => {
    accessor().then((result) => setData(result));
  }, []);

  return data;
}
