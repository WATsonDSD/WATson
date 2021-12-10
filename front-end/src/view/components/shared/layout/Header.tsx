import React, { ReactElement } from 'react';
import { useUserData } from '../../../../data';

Header.defaultProps = {
  button: null,
};

export default function Header(props: { title: string, button? : ReactElement }) {
  const { title, button } = props;
  const [user] = useUserData();

  return (
    <header className="sticky top-0 mb-8">
      <div className="w-full flex items-center gap-4">
        <h1 className="text-2xl font-medium uppercase items-start">{title}</h1>
        {user && user.role === 'projectManager' ? button : ''}
      </div>
    </header>
  );
}
