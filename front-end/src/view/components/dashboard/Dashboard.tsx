import React from 'react';
import { getLoggedInUser, getProjectsOfUser } from '../../../data';
import useData from '../../../data/hooks';
import Card from './Card';

export default function Dashboard() {
  const projects = useData(async () => {
    const user = await getLoggedInUser();
    return getProjectsOfUser(user);
  });

  return (
    <div>
      <div className="Card">
        <div className="w-full bg-gray-100">
          <section className="max-w-5xl my-1 px-4 sm:px-4 lg:px-6 py-6">
            {projects?.map((project) => (
              <Card project={project} />
            ))}
          </section>
        </div>

      </div>
    </div>
  );
}
