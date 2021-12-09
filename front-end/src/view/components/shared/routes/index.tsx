import React from 'react';

import {
  Route,
  Routes,
} from 'react-router-dom';

import Protected from '../../protected';
import Layout from '../layout';

import Authentication from '../../authentication';
import Projects from '../../projects';
import Workers from '../../workers/Workers';
import CreateProject from '../../createProject';
import EditProject from '../../editProject';
import Annotation from '../../annotation';
import ProjectFinance from '../../projectFinanceSummary/ProjectFinance';

export const Paths = {
  Authentication: '/authentication',
  Projects: '/',
  Workers: 'workers',
  CreateProject: 'createProject',
  EditProject: 'editProject',
  Annotation: 'annotation',
  ProjectFinance: 'projectFinance',
};

export default () => (
  <Routes>
    <Route path={Paths.Authentication} element={<Authentication />} />

    <Route path={Paths.Projects} element={<Protected><Layout /></Protected>}>
      <Route index element={<Projects />} />
      <Route path={Paths.Workers} element={<Workers />} />
      <Route path={Paths.EditProject} element={<EditProject />}>
        <Route path=":idProject" element={<Workers />} />
      </Route>
      <Route path={Paths.CreateProject} element={<CreateProject />} />
      <Route path={Paths.Annotation} element={<Annotation />}>
        <Route path=":projectId" element={<Annotation />} />
      </Route>
      <Route path={Paths.ProjectFinance} element={<ProjectFinance />}>
        <Route path=":idProject" element={<ProjectFinance />} />
      </Route>
    </Route>
  </Routes>
);
