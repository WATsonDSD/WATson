import React, { useState } from 'react';
import { getLoggedInUser, getProjectsOfUser } from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';
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
  {
    role: 'finance',
    text: 'Generate Finances',
  },
  {
    role: 'finance',
    text: 'Consult work hours',
  },
];

export default function Dashboard() {
  const [role, setRole] = useState('annotator');

  const projects = useData(async () => {
    const user = await getLoggedInUser(role);
    return getProjectsOfUser(user);
  });

  const changeRoleActions = [<button key="changeToAnnotator" className="w-full" type="button" onClick={() => setRole('annotator')}> Annotator </button>,
    <button type="button" key="changeToVerifier" className="w-full" onClick={() => setRole('verifier')}> Verifier </button>,
    <button type="button" key="changeToPM" className="w-full" onClick={() => setRole('projectManager')}> Project Manager </button>,
    <button type="button" key="changeToF" className="w-full" onClick={() => setRole('finance')}> Finance </button>];

  const actions = actionsProject.filter((action) => (
    action.role === role
  ));
  return (
    <div className="min-h-full w-full">
      <div>
        <Header title={`Dashboard ${role}`} />
        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-20 ml-auto">
          <Dropdown text="Change Role" elements={changeRoleActions} />
        </div>
      </div>

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
