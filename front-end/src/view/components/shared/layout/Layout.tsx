import React from 'react';
import { useUserContext } from '../../../../data';
import Sidebar from '../menu/Sidebar';
import Routing from '../routing/Routing';

export default function Layout() {
  const user = useUserContext();
  return (
    <div id="main">
      { user && user !== 'isLoading' && <Sidebar />}
      <div id="main-content">
        <div id="content"><Routing /></div>
      </div>
    </div>
  );
}
