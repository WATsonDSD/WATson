import React from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { getLoggedInUser, getProjectsOfUser } from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';
import Card from './Card';

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
  const projects = useData(async () => {
    const user = await getLoggedInUser();
    return getProjectsOfUser(user.id);
  });

  const addProjectButton = (
    <button id="addProject" className="ml-4" type="button" onClick={() => null}>
      <BsPlusLg className="w-30 h-30" />
      {' '}
    </button>
  );

  const actions = actionsProject.filter(() => (
    true
  ));
  return (
    <div className="min-h-full w-full">
      <div>
        <Header title="Projects" button={addProjectButton} />
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
