import React from 'react';

import { NavLink } from 'react-router-dom';
import { useUserNotNull } from '../../../../data';

import { MenuConfigurations } from './menu-configurations';

import logo from '../../../logo.svg';

function Sidebar() {
  const [user] = useUserNotNull();

  return (
    <div id="side-menu" className="flex flex-col w-full h-full overflow-y-auto relative">
      <img className="w-2/5 ml-4 mb-16" src={logo} alt="Logo" />
      <div className="flex flex-col justify-between h-full">
        <nav className="flex flex-col gap-4">
          {
            Object.entries(MenuConfigurations[user.role]).map((item) => (
              <NavLink
                key={item[0]}
                to={item[1].href}
                className={(navData) => `capitalize flex items-center gap-x-4 px-6 py-3 max-w-min ${navData.isActive ? ' bg-black text-white rounded-full'
                  : 'text-black hover:bg-gray-200 transition-colors duration-200 rounded-full'}`}
              >
                {item[1].icon}
                <span className="mx-4 font-medium">{item[0]}</span>
              </NavLink>
            ))
          }
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
