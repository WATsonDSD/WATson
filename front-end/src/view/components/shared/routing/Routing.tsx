import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Workers from '../../workers/Workers';
import Dashboard from '../../dashboard/Dashboard';
import CreateProject from '../../createProject/CreateProject';
import ProjectEdit from '../../editProject/ProjectEdit';
import AnnotationView from '../../annotation/AnnotationView';

export default function Routing() {
  return (
    <Routes>
      <Route path="/workers" element={<Workers />} />
      <Route path="/editProject" element={<ProjectEdit />}>
        <Route path=":idProject" element={<Workers />} />
      </Route>
      <Route path="/createProject" element={<CreateProject />} />
      <Route path="/annotationView" element={<AnnotationView />}>
        <Route path=":projectId" element={<AnnotationView />} />
      </Route>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
