import React from 'react';

import { getAllUsers } from '../../../data';

import useData from '../../../data/hooks';
import Header from '../shared/header';
import Hours from './Hours';

export default function Workers() {
  const users = useData(async () => getAllUsers());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const options = [
    {
      text: 'Edit Worker',
      onClick: () => {}, // TODO: implement update user data dialog
    },
    {
      name: 'Award Bonus',
      href: '/Workers/',
    },
    {
      name: 'Delete User',
      onClick: () => {}, // TODO: implement delete user dialog
    },
  ];

  // const dropDownActions = actions.map((action: any) => {
  //   if (action.href === '') {
  //     return (
  //       <button
  //         id={`${action.text}-btn`}
  //         type="button"
  //         onClick={action.onClick}
  //       >
  //         {action.text}
  //       </button>
  //     );
  //   }
  //   return (
  //     <Link
  //       id={`${action.text}-btn`}
  //       type="button"
  //       onClick={(event) => event.stopPropagation()}
  //       to={`${action.href}`}
  //     >
  //       {action.text}
  //     </Link>
  //   );
  // });

  const OptionsIcon = (
    <svg width="5" height="14" viewBox="0 0 5 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="2.5" cy="2.5" r="2.5" fill="black" />
      <circle cx="2.5" cy="11.5" r="2.5" fill="black" />
    </svg>
  );

  return (
    <>
      <Header title="Workers" />
      <main id="content">
        <section className="p-8 pb-0 bg-white border rounded-lg">
          <div className="grid grid-cols-9 gap-x-4 pb-3 text-sm text-gray-500 font-medium">
            <span className="col-span-2">Name</span>
            <span className="col-span-3">Email</span>
            <span>Role</span>
            <span>N° of projects</span>
            <span>Hours of work</span>
            <span className="justify-self-center">Actions</span>
          </div>

          {users && users.length > 0
            ? users.filter((user) => user.role !== 'projectManager' && user.role !== 'finance').map((user) => (
              <div key={user.id} className="grid grid-cols-9 items-center gap-x-4 py-4 text-gray-800 border-t">
                <div className="flex items-center gap-x-4 col-span-2">
                  <span className="block w-10 h-10 bg-gray-100 rounded-full" />
                  <span>{user.name}</span>
                </div>
                <span className="col-span-3">{user.email}</span>
                <div>
                  <span className={`uppercase tracking-wide ${user.role === 'annotator' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'} px-4 py-2 -ml-4 text-xs font-bold rounded-full`}>{user.role}</span>
                </div>
                <span>{Object.entries(user.projects).length}</span>
                <Hours user={user} />
                <button type="button" className="p-4 justify-self-center">
                  {OptionsIcon}
                </button>
              </div>
            ))
            : (
              <div className="flex items-center justify-center py-4 text-gray-400">There are no workers registered to the application.</div>
            )}
        </section>
      </main>
    </>
  );
}
