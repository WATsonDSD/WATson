import React, { ReactElement } from 'react';
import { useUserNotNull } from '../../../../data';
import UserSettings from '../sidebar/UserSettings';

Header.defaultProps = {
  buttonPM: null,
  buttonF: null,
};


export default function Header(props: { title: string, buttonPM? : ReactElement, buttonF? : ReactElement }) {
  const { title, buttonPM, buttonF } = props;
  const [user] = useUserNotNull();

  return (
    <header className="flex items-center justify-between bg-white sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-medium uppercase items-start">{title}</h1>
        {user && user.role === 'projectManager' ? buttonPM : ''}
        {user && user.role === 'finance' ? buttonF : ''}
      </div>
      <UserSettings />
    </header>
  );
}
