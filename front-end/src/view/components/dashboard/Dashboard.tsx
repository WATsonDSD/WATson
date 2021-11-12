import React from 'react';
import { getLoggedInUser, getProjectsOfUser } from '../../../data';
import useData from '../../../data/hooks';
import Card from './Card';
import Dropdown from './Dropdown';

export default function Dashboard() {
  const projects = useData(async () => {
    const user = await getLoggedInUser();
    return getProjectsOfUser(user);
  });

  return (
    <div className="min-h-full w-full">
      <header className="sticky top-0 bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex gap-1">
          <h1 className="text-3xl font-bold text-gray-900 items-start">Dashboard</h1>
          <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Dropdown text="Change Role" elements={[<button type="button" onClick={() => { console.log('Change role to annotator'); }}> Annotator </button>]} />
          </span>
        </div>
      </header>
      <div className="Card min-h-full">
        <div className="w-full min-h-full bg-gray-50">
          <section className="max-w-5xl my-1 px-4 sm:px-4 lg:px-6 py-6 h-screen">
            {projects?.map((project) => (
              <Card project={project} />
            ))}
          </section>
        </div>

      </div>
    </div>
  );
}
