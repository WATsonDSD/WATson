import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Workers from '../../workers/Workers';
import Dashboard from '../../dashboard/Dashboard';
import CreateProject from '../../createProject/CreateProject';
import ProjectEdit from '../../editProject/ProjectEdit';
import AnnotationView from '../../annotation/AnnotationView';
import Authentication from '../../authentication';
import Protected from '../../protected';
import UserSettings from '../menu/UserSettings';
import ProjectFinance from '../../projectFinanceSummary/ProjectFinance';

export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Authentication />} />
      <Route path="/workers" element={<Protected><Workers /></Protected>} />
      <Route path="/editProject" element={<Protected><ProjectEdit /></Protected>}>
        <Route path=":idProject" element={<Protected><Workers /></Protected>} />
      </Route>
      <Route path="/createProject" element={<Protected><CreateProject /></Protected>} />
      <Route path="/annotationView" element={<Protected><AnnotationView /></Protected>}>
        <Route path=":projectId" element={<Protected><AnnotationView /></Protected>} />
      </Route>
      <Route path="/projectFinance" element={<Protected><ProjectFinance /></Protected>}>
        <Route path=":idProject" element={<Protected><ProjectFinance /></Protected>} />
      </Route>
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/userSettings" element={<Protected><UserSettings /></Protected>} />
    </Routes>
  );
}
