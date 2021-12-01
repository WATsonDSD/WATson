import React from 'react';
import { useUserData } from '../../../../data';
import Sidebar from '../menu/Sidebar';
import Routing from '../routing/Routing';

export default function Layout() {
  const [user, sessionState] = useUserData();
  return (
    <div id="main">
      { user && sessionState !== 'pending' && sessionState !== 'none' && <Sidebar />}
      <div id="main-content">
        <div id="content"><Routing /></div>
      </div>
    </div>
  );
}
