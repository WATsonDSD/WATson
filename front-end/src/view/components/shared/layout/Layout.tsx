import React from 'react';
import Sidebar from '../menu/Sidebar';
import Routing from '../routing/Routing';

//  { user && user !== 'isLoading' && <Sidebar />}
export default function Layout() {
  // const user = useUserContext();
  return (
    <div id="main">
      <Sidebar />
      <div id="main-content">
        <div id="content"><Routing /></div>
      </div>
    </div>
  );
}
