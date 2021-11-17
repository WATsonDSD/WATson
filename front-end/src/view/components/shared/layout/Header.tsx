import React, { ReactElement } from 'react';

Header.defaultProps = {
  button: null,
};

export default function Header(props: { title: string, button? : ReactElement }) {
  const { title, button } = props;
  return (
    <header className="sticky top-0 bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex gap-1">
        <h1 className="text-3xl font-bold text-gray-900 items-start">{title}</h1>
        {button || ''}
      </div>
    </header>
  );
}
