import React from 'react';
import Sidebar from '../menu/Sidebar';
import Routing from '../routing/Routing';

export default function Layout() {
  return (
    <div>
      <Sidebar />
      <Routing />
    </div>
  );
}
