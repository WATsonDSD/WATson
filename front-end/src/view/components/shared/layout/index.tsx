import React from 'react';

import { Outlet } from 'react-router-dom';

import Sidebar from '../sidebar';
import Modals from './Modals';

export default function Layout() {
  return (
    <div id="main">
      <Modals />
      <Sidebar />
      <div id="main-content">
        <Outlet />
      </div>
    </div>
  );
}
