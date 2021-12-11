import React, { ReactElement } from 'react';
import { useUserData } from '../../../../data';

Header.defaultProps = {
  buttonPM: null,
  buttonF: null,
};

export default function Header(props: { title: string, buttonPM? : ReactElement, buttonF? : ReactElement }) {
  const { title, buttonPM, buttonF } = props;
  const [user] = useUserData();

  return (
    <header className="sticky top-0 mb-8">
      <div className="w-full flex items-center gap-4">
        <h1 className="text-2xl font-medium uppercase items-start">{title}</h1>
        {user && user.role === 'projectManager' ? buttonPM : ''}
        {user && user.role === 'finance' ? buttonF : ''}
      </div>
    </header>
  );
}
