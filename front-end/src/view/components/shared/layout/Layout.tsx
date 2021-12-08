import React from 'react';
import { useUserContext } from '../../../../data';
import Sidebar from '../menu/Sidebar';
import Routing from '../routing/Routing';
import Modals from './Modals';

export default function Layout() {
  const user = useUserContext();
  console.log(user);
  return (
    <div id="main">
      { user && user !== 'isLoading' && <Sidebar />}
      <div id="main-content">
        <div id="content">
          <Routing />
          <Modals />
        </div>
      </div>
    </div>
  );
}
