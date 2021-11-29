import React from 'react';
import Sidebar from '../menu/Sidebar';
import Routing from '../routing/Routing';

export default function Layout() {
  return (
    <div id="main">
      <Sidebar />
      <div id="main-content">
        <div id="content"><Routing /></div>
      </div>
    </div>
  );
}
