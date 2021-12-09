import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useUserData } from '../../../../data';
import Sidebar from '../menu/Sidebar';
import Routing from '../routing/Routing';

export default function Layout() {
  const [user, sessionState] = useUserData();

  return (
    <div id="main">
      { user && sessionState === 'authenticated' && <Sidebar />}
      <div id="main-content">
        <DndProvider backend={HTML5Backend}>
          <div id="content"><Routing /></div>
        </DndProvider>
      </div>
    </div>
  );
}
