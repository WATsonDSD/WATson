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
    href: '/pageA/',
  },
  {
    role: 'projectManager',
    text: 'Close',
    href: '/pageA/',
  },
  {
    role: 'projectManager',
    text: 'Delete',
    href: '/pageA/',
  },
  {
    role: 'annotator',
    text: 'Annotate Images',
    href: '/pageA/',
  },
  {
    role: 'verifier',
    text: 'Verify Images',
    href: '/pageA/',
  },
  {
    role: 'finance',
    text: 'Generate Finances',
    href: '/pageA/',
  },
  {
    role: 'finance',
    text: 'Consult work hours',
    href: '/pageA/',
  },
];

export default function Dashboard() {
  const projects = useData(async () => {
    const user = await getLoggedInUser();
    return getProjectsOfUser(user.id);
  });

  const addProjectButton = (
    <Link id="addProject" className="ml-4  mt-auto mb-auto" type="button" to="/createProject">
      <BsPlusLg className="w-30 h-30 mt-auto mb-auto" />
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
