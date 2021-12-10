import React from 'react';

import { Outlet } from 'react-router-dom';

import Sidebar from '../sidebar';

export default function Layout() {
  return (
    <div id="main">
      <Sidebar />
      <div id="main-content">
        <Outlet />
      </div>
    </div>
  );
}
