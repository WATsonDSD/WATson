import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import {
  useUserNotNull,
  getProjectsOfUser,
  closeProject,
} from '../../../data';

import useData from '../../../data/hooks';
import Header from '../shared/header';
import Card from './Card';

import { Paths } from '../shared/routes';
import Loading from '../loading';

export default function Dashboard() {
  const [user] = useUserNotNull();
  const { type } = useParams();
  const navigate = useNavigate();

  const projects = useData(() => getProjectsOfUser(user!._id));
  if (user.role === 'verifier' && type !== 'annotate' && type !== 'verify') navigate('/annotate');

  if (!projects || !user) {
    return <Loading />;
  }

  const projectOptions: {[role: string] : {name: string, to?: string, action?: Function}[]} = {
    projectManager: [
      {
        name: 'Edit',
        to: Paths.EditProject,
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
        name: 'Close & Get Landmarks',
        action: closeProject,
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
    finance: [],
  };

  return (
    <div className="w-full">
      <div>
        <Header title="Projects" />
      </div>
      <div id="content" className="min-h-full">
        <div className="w-full min-h-full">
          <section className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {projects?.map((project) => (
              <Card
                key={project.id}
                project={project}
                options={projectOptions[user!.role]}
                verifierAction={type}
              />
            ))}
          </section>
        </div>

      </div>
    </div>
  );
}
