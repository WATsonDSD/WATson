import React from 'react';

import {
  Route,
  Routes,
} from 'react-router-dom';

import Authentication from '../../authentication';

import Protected from '../../protected';
import Layout from '../layout';
import Projects from '../../projects';
import Project from '../../project';
import Workers from '../../workers';
import CreateProject from '../../createProject';
import EditProject from '../../editProject';
import Annotation from '../../annotation';
import ProjectAssign from '../../project/ProjectAssign';
import ProjectFinance from '../../projectFinanceSummary/ProjectFinance';
import ReportFinance from '../../projectFinanceSummary/ReportFinance';
import VerificationView from '../../verification';
import WorkerFinance from '../../projectFinanceSummary/WorkerStatistics';

export const Paths = {
  Authentication: '/authentication',
  Projects: '/',
  Project: '/project',
  CreateProject: '/createProject',
  EditProject: '/editProject',
  Workers: '/workers',
  Annotation: '/annotation',
  Verification: '/verification',
  Finances: '/finances',
  ProjectAssign: '/projectAssign',
  ProjectFinance: '/projectFinance',
  Reports: '/reports',
  Statistics: '/statistics',
};

export default () => (
  <Routes>
    <Route path={Paths.Authentication} element={<Authentication />} />

    <Route path={Paths.Projects} element={<Protected><Layout /></Protected>}>
      <Route index element={<Projects />} />
      <Route path="/:type" element={<Projects />} />
      <Route path={Paths.Workers} element={<Workers />} />
      <Route path={Paths.Project} element={<Project />}>
        <Route path=":idProject" element={<Workers />} />
      </Route>
      <Route path={Paths.EditProject} element={<EditProject />}>
        <Route path=":idProject" element={<EditProject />} />
      </Route>
      <Route path={Paths.CreateProject} element={<CreateProject />} />
      <Route path={Paths.Annotation} element={<Annotation />}>
        <Route path=":projectId" element={<Annotation />} />
      </Route>
      <Route path={Paths.Verification} element={<VerificationView />}>
        <Route path=":projectId" element={<VerificationView />} />
      </Route>
      <Route path={Paths.ProjectFinance} element={<ProjectFinance />}>
        <Route path=":idProject" element={<ProjectFinance />} />
      </Route>
      <Route path={Paths.Reports} element={<ReportFinance />} />
      <Route path={Paths.ProjectAssign} element={<ProjectAssign />}>
        <Route path=":idProject" element={<ProjectAssign />} />
      </Route>
      <Route path={Paths.Finances} element={<WorkerFinance />} />
    </Route>
  </Routes>
);
