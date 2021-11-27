import React from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { getLoggedInUser, getProjectsOfUser } from '../../../data';
import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';
import Card from './Card';

const actionsProject = [
  {
    role: 'projectManager',
    text: 'Edit',
    href: '/pageC/',
  },
  {
    role: 'projectManager',
    text: 'Close',
    href: '/pageC/',
  },
  {
    role: 'projectManager',
    text: 'Delete',
    href: '/pageC/',
  },
  {
    role: 'annotator',
    text: 'Annotate Images',
    href: '/pageC/',
  },
  {
    role: 'verifier',
    text: 'Verify Images',
    href: '/pageC/',
  },
  {
    role: 'finance',
    text: 'Generate Finances',
    href: '/pageC/',
  },
  {
    role: 'finance',
    text: 'Consult work hours',
    href: '/pageC/',
  },
];

export default function Dashboard() {
  const projects = useData(async () => {
    const user = await getLoggedInUser();
    return getProjectsOfUser(user.id);
  });

  const addProjectButton = (
    <Link id="addProject" className="ml-4" type="button" to="/createProject">
      <BsPlusLg className="w-30 h-30" />
      {' '}
    </Link>
  );

  return (
    <div className="min-h-full w-full">
      <div>
        <Header title="Projects" button={addProjectButton} />
      </div>

      <div className="Card min-h-full">
        <div className="w-full min-h-full bg-gray-50">
          <section className="flex gap-8 max-w-5xl my-1 px-4 sm:px-4 lg:px-6 py-6 h-screen">
            {projects?.map((project) => (
              <Card key={project.id} project={project} actions={actionsProject} />
            ))}
          </section>
        </div>

      </div>
    </div>
  );
}
