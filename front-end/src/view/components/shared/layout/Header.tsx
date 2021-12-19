import React from 'react';
import { useUserNotNull } from '../../../../data';
import UserSettings from '../sidebar/UserSettings';

import PlusIcon from '../../../../assets/icons/plus.svg';

const actions: {[role: string]: VoidFunction } = {
  projectManager: () => {}, // TODO: waiting for merge to implement
  finance: () => {}, // TODO: waiting for merge to implement
};

export default function Header(props: { title: string}) {
  const { title } = props;
  const [user] = useUserNotNull();

  return (
    <header className="flex items-center justify-between bg-white sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-medium uppercase items-start">{title}</h1>
        { user && actions[user.role] && (
        <button type="button" onClick={actions[user.role]} className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-10 h-10 rounded-full">
          <img src={PlusIcon} alt="Action" />
        </button>
        )}
      </div>
      <UserSettings />
    </header>
  );
}
