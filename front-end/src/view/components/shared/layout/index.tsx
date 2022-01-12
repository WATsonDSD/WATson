import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Outlet } from 'react-router-dom';
import { LoadingOverLay } from '../../../LoadingOverlay';

import Sidebar from '../sidebar';

export default function Layout() {
  return (
    <div id="main">
      <LoadingOverLay />
      <Sidebar />
      <DndProvider backend={HTML5Backend}>
        <div id="main-content">
          <Outlet />
        </div>
      </DndProvider>
    </div>
  );
}
