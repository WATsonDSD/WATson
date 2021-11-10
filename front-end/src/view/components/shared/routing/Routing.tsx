import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageA from '../../pageA/PageA';
import PageB from '../../pageB/PageB';
import PageC from '../../pageC/PageC';
import PageD from '../../pageD/PageD';

export default function Routing() {
  return (
    <Routes>
      <Route path="/pageA" element={<PageA />} />
      <Route path="/pageB" element={<PageB />} />
      <Route path="/pageC" element={<PageC />} />
      <Route path="/pageD" element={<PageD />} />
    </Routes>
  );
}
