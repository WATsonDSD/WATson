import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageA from '../../pageA/PageA';
import PageB from '../../pageB/PageB';
import PageC from '../../pageC/PageC';
import Dashboard from '../../dashboard/Dashboard';

export default function Routing() {
  return (
    <Routes>
      <Route path="/pageA" element={<PageA />}>
        <Route path=":param" element={<PageA />} />
      </Route>
      <Route path="/pageB" element={<PageB />} />
      <Route path="/pageC" element={<PageC />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
