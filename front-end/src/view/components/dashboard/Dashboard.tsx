import React, { useState } from 'react';
import { getLoggedInUser, getProjectsOfUser } from '../../../data';
import useData from '../../../data/hooks';
import Card from './Card';
import Dropdown from './Dropdown';

const actionsProject = [
  {
    role: 'projectManager',
    text: 'Edit',
  },
  {
    role: 'projectManager',
    text: 'Close',
  },
  {
    role: 'projectManager',
    text: 'Delete',
  },
  {
    role: 'annotator',
    text: 'Annotate Images',
  },
  {
    role: 'verifier',
    text: 'Verify Images',
  },
];

export default function Dashboard() {
  const [role, setRole] = useState('annotator');

  const projects = useData(async () => {
    const user = await getLoggedInUser(role);
    return getProjectsOfUser(user);
  });

  const changeRoleActions = [<button key="changeToAnnotator" type="button" onClick={() => setRole('annotator')}> Annotator </button>,
    <button type="button" key="changeToVerifier" onClick={() => setRole('verifier')}> Verifier </button>,
    <button type="button" key="changeToPM" onClick={() => setRole('projectManager')}> Project Manager </button>];

  const actions = actionsProject.filter((action) => (
    action.role === role
  ));
  return (
    <div className="min-h-full w-full">
      <header className="sticky top-0 bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex gap-1">
          <h1 className="text-3xl font-bold text-gray-900 items-start">Dashboard</h1>
          <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Dropdown text="Change Role" elements={changeRoleActions} />
          </span>
        </div>
      </header>
      <div className="Card min-h-full">
        <div className="w-full min-h-full bg-gray-50">
          <section className="flex gap-8 max-w-5xl my-1 px-4 sm:px-4 lg:px-6 py-6 h-screen">
            {projects?.map((project) => (
              <Card key={project.id} project={project} actions={actions} />
            ))}
          </section>
        </div>

      </div>
    </div>
  );
}
