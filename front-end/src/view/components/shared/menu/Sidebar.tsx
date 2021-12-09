import React from 'react';

import { MdSettings } from 'react-icons/md';
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
          <hr className="my-1" />
          <NavLink
            to="/pageA" // just for test
            className={(navData) => (navData.isActive ? 'capitalize flex items-center px-4 py-2 bg-black text-white hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200 transform rounded-md'
              : 'capitalize flex items-center px-4 py-2 text-black hover:bg-black hover:text-white transition-colors duration-200 transform rounded-md')}
            id=""
          >
            <MdSettings className="w-5 h-5" />
            <span className="mx-4 font-medium">Profile settings</span>
          </NavLink>
        </nav>
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            alt="avatar"
            className="h-9 w-9 mx-2 object-center object-cover rounded-full"
          />
          <h4 className="mx-2 font-medium text-gray-800 hover:underline cursor-pointer">
            { user ? user.name : 'loading...'}
            {' '}
            |
            {' '}
            {user ? user.role : 'loading...'}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
