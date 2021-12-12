import React from 'react';

import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import {
  useUserData,
  deleteProject,
  getProjectsOfUser,
} from '../../../data';

import useData from '../../../data/hooks';
import Header from '../shared/layout/Header';
import Card from './Card';

import { Paths } from '../shared/routes';

export default function Dashboard() {
  const [user] = useUserData();
  const projects = useData(() => getProjectsOfUser(user!.id));

  const projectOptions: {[role: string] : {name: string, to?: string, action?: Function}[]} = {
    projectManager: [
      {
        name: 'Edit',
        to: Paths.Project,
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

  const addProjectButton = (
    <Link id="addProject" className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full" type="button" to={Paths.CreateProject}>
      <BsPlusLg className="w-30 h-30 mt-auto mb-auto" />
    </Link>
  );

  return (
    <div className="w-full">
      <div>
        <Header title="Projects" buttonPM={addProjectButton} />
      </div>
      <div id="content" className="min-h-full">
        <div className="w-full min-h-full">
          <section className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {projects?.map((project) => (
              <Card
                key={project.id}
                project={project}
                options={projectOptions[user!.role]}
              />
            ))}
          </section>
        </div>

      </div>
    </div>
  );
}
