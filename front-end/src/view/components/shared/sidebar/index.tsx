import React from 'react';

import { NavLink } from 'react-router-dom';
import { useUserData } from '../../../../data';

import logo from '../../../logo.svg';

function Sidebar() {
  const [user] = useUserData();

  let links: any = [];

  /* eslint-disable global-require */

  switch (user?.role) {
    case 'projectManager':
      // import { linksPM } from './MenuConfig';
      links = require('./MenuConfigPM').links;
      break;
    case 'annotator':
      links = require('./MenuConfigAnnotator').links;
      break;
    case 'verifier':
      links = require('./MenuConfigVerifier').links;
      break;
    case 'finance':
      links = require('./MenuConfigFinance').links;
      break;
    default:
      links = require('./MenuConfigPM').links;
  }

  console.log(links);
  /* eslint-enable global-require */

  return (
    <div id="side-menu" className="flex flex-col w-full h-full overflow-y-auto relative">
      <img className="w-2/5 ml-4 mb-16" src={logo} alt="Logo" />
      <div className="flex flex-col justify-between h-full">
        <nav className="flex flex-col gap-4">
          {links.map((link: any) => {
            const {
              id, name, href, icon,
            } = link;
            return (
              <NavLink
                to={href}
                className={(navData) => (navData.isActive ? 'capitalize flex items-center px-6 py-3 max-w-min bg-black text-white rounded-full'
                  : 'capitalize flex items-center px-6 py-3 max-w-min text-black hover:bg-black hover:text-white transition-colors duration-200 transform rounded-full')}
                key={id ? `${id}` : ''}
                id={id ? `${id}` : ''}
              >
                {icon}
                <span className="mx-4 font-medium">{name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
