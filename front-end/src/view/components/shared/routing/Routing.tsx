import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Workers from '../../workers/Workers';
import PageB from '../../pageB/PageB';
import Dashboard from '../../dashboard/Dashboard';
import CreateProject from '../../createProject/CreateProject';
import ProjectEdit from '../../editProject/ProjectEdit';

export default function Routing() {
  return (
    <Routes>
      <Route path="/workers" element={<Workers />} />
      <Route path="/pageB" element={<PageB />} />
      <Route path="/pageB" element={<PageB />}>
        <Route path=":param" element={<Workers />} />
      </Route>
      <Route path="/createProject" element={<CreateProject />} />
      <Route path="/editProject" element={<ProjectEdit />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
