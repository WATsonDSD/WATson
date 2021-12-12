import React from 'react';

import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import {
  getProjectsOfUser, useUserData,
} from '../../../data';

import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';
import Card from './Card';

import { Paths } from '../shared/routes';

export default function Dashboard() {
  const [user] = useUserData();
  const projects = useData(() => getProjectsOfUser(user!.id));

  const projectActions = [
    {
      role: 'projectManager',
      text: 'Edit',
      href: '/pageC/',
    },
    {
      role: 'projectManager',
      text: 'Upload Images',
      href: Paths.Project,
    },
    {
      role: 'projectManager',
      text: 'Finance',
      href: Paths.ProjectFinance,
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
      href: Paths.Annotation,
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

  const addProjectButton = (
    <Link id="addProject" className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full" type="button" to="/createProject">
      <BsPlusLg className="w-30 h-30 mt-auto mb-auto" />
      {' '}
    </Link>
  );

  return (
    <div className="w-full">
      <Header title="Projects" button={addProjectButton} />

      <div id="content" className="min-h-full">
        <div className="w-full min-h-full">
          <section className="grid grid-cols-3 2xl:grid-cols-4 gap-4">
            {projects?.map((project) => (
              <Card
                key={project.id}
                project={project}
                actions={projectActions.filter((a) => a.role === user!.role)}
              />
            ))}
          </section>
        </div>

      </div>
    </div>
  );
}
