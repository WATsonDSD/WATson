import React, { ReactElement } from 'react';
import { useUserData } from '../../../../data';
import UserSettings from '../sidebar/UserSettings';

Header.defaultProps = {
  button: null,
};

export default function Header(props: { title: string, button? : ReactElement }) {
  const { title, button } = props;

  const [user] = useUserData();

  return (
    <header className="flex items-center justify-between bg-white sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-medium uppercase items-start">{title}</h1>
        {user && user.role === 'projectManager' ? button : ''}
      </div>
      <UserSettings />
    </header>

  );
}
