import React from 'react';

import {
  useUserNotNull,
  deleteProject,
  getProjectsOfUser,
} from '../../../data';

import useData from '../../../data/hooks';
import Header from '../shared/header';
import Card from './Card';

import { Paths } from '../shared/routes';
import Loading from '../loading';

export default function Dashboard() {
  const [user] = useUserNotNull();
  const projects = useData(() => getProjectsOfUser(user!.id));

  if (!projects || !user) {
    return <Loading />;
  }

  const projectOptions: {[role: string] : {name: string, to?: string, action?: Function}[]} = {
    projectManager: [
      {
        name: 'Edit',
        to: Paths.Project,
      },
      {
        name: 'Assign Images',
        to: Paths.ProjectAssign,
      },
      {
        name: 'Upload Images',
        to: Paths.Project,
      },
      {
        name: 'Finance',
        to: Paths.ProjectFinance,
      },
      {
        name: 'Close',
        action: () => null,
      },
      {
        name: 'Delete',
        action: deleteProject,
      },
    ],
    annotator: [
      {
        name: 'Annotate Images',
        to: Paths.Annotation,
      },
    ],
    verifier: [
      {
        name: 'Verify Images',
        to: Paths.Verification,
      },
    ],
    finance: [
      {
        name: 'Generate Report',
        to: Paths.Reports,
      },
    ],
  };

  return (
    <>
      <Header title="Projects" />
      <div id="content" className="h-full">
        {projects && projects.length > 0 ? (
          <section className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {projects?.map((project) => (
              <Card
                key={project.id}
                project={project}
                options={projectOptions[user!.role]}
              />
            ))}
          </section>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 -mt-12">Tap the + button to add your first project.</div>
        )}
      </div>
    </>
  );
}
