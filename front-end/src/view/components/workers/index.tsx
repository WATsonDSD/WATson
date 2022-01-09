import React from 'react';

import { getAllUsers } from '../../../data';

import useData from '../../../data/hooks';
import Header from '../shared/header';
import Hours from './Hours';

import OptionsIcon from '../../../assets/icons/options-black.svg';

import Dropdown from './Dropdown';

export default function Workers() {
  const users = useData(async () => getAllUsers());

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
              <div key={user._id} className="grid grid-cols-9 items-center gap-x-4 py-4 text-gray-800 border-t">
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
                <Dropdown user={user} icon={<img src={OptionsIcon} alt="Options" />} />
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
