import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageA from '../../pageA/PageA';
import PageB from '../../pageB/PageB';
import Dashboard from '../../dashboard/Dashboard';
import CreateProject from '../../createProject/CreateProject';

export default function Routing() {
  return (
    <Routes>
      <Route path="/pageA" element={<PageA />}>
        <Route path=":param" element={<PageA />} />
      </Route>
      <Route path="/pageB" element={<PageB />} />
      <Route path="/createProject" element={<CreateProject />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
