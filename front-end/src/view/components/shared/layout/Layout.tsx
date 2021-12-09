import React from 'react';
import Sidebar from '../menu/Sidebar';
import Routing from '../routing/Routing';

import { useUserData } from '../../../../data';

export default function Layout() {
  const [user, sessionState] = useUserData();

  return (
    <div id="main">
      { user && sessionState === 'authenticated' && <Sidebar />}
      <div id="main-content">
        <div id="content"><Routing /></div>
      </div>
    </div>
  );
}
