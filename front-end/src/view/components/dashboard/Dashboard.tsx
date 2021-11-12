import React from 'react';
import { getLoggedInUser, getProjectsOfUser } from '../../../data';
import useData from '../../../data/hooks';

export default function Dashboard() {
  const projects = useData(async () => {
    const user = await getLoggedInUser();
    return getProjectsOfUser(user);
  });

  return (
    <div>
      <div>this is the dashboard page</div>
      {JSON.stringify(projects).toString()}
    </div>
  );
}
