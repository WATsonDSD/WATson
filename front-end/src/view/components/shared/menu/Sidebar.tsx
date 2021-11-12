import React from 'react';
import { MdSettings } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { links } from './MenuConfig';
import { User } from '../../../../data/types';
import { getLoggedInUser } from '../../../../data';

class Sidebar extends React.Component<any, { user: User | null }> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: null,
    };

    getLoggedInUser()
      .then((loggedInUser) => this.setState({ user: loggedInUser }));
  }

  // componentDidMount() {
  //   this.setState({
  //     user: Sidebar.getCurrentUser(),
  //   });
  // }

  render() {
    const { user } = this.state;
    return (
      <div
        className={`transition-all  duration-500  fixed top-0 ${
          'left-0'
        }`}
      >
        <div className="flex h-screen overflow-y-auto flex-col bg-white  w-64 px-4 py-8 border-r min-h-screen relative">
          <h2 className="text-3xl font-semibold text-gray-800">
            WAT
            <span className="text-indigo-500 ml-1">son</span>
          </h2>
          <div className="flex flex-col mt-6  justify-between flex-1">
            <nav className="text">
              {links.map((link) => {
                const {
                  id, name, href, icon,
                } = link;
                return (
                  <NavLink
                    to={href}
                     // 'bg-gray-200 text-gray-700' if active
                    className={(navData) => (navData.isActive ? 'capitalize flex items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200 transform rounded-md bg-gray-200 text-gray-700'
                      : 'capitalize flex items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200 transform rounded-md')}
                    key={id ? `${id}` : ''}
                    id={id ? `${id}` : ''}
                  >
                    {icon}
                    <span className="mx-4 font-medium">{name}</span>
                  </NavLink>
                );
              })}
              <hr className="my-6" />
              <NavLink
                to="/pageA" // just for test
                className="flex items-center px-4 py-2 mt-5 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-colors transform"
                id=""
              >
                <MdSettings className="w-5 h-5" />
                <span className="mx-4 font-medium">Profile settings</span>
              </NavLink>
            </nav>
            <div className="flex items-center px-4 -mx-2 mt-5">
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
                {user.role}
              </h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
