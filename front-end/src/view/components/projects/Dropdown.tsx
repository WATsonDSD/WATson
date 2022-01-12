import React, { Fragment, ReactElement } from 'react';

import {
  Menu,
  Transition,
} from '@headlessui/react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const Dropdown = (props: {elements: ReactElement[], icon: ReactElement}) => {
  const { elements, icon } = props;

  let counter = 0;

  return (
    <div className="Dropdown">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button>
          <span className="block p-4 -m-4">{icon}</span>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-10 origin-top-right absolute bg-white rounded-md shadow-lg py-2 focus:outline-none">
            {elements?.map((element : ReactElement) => {
              counter += 1;
              return (
                <Menu.Item key={counter}>
                  {({ active }) => (
                    <span
                      key={counter}
                      className={classNames(
                        active ? 'text-black' : 'text-gray-500',
                        'block text-base',
                      )}
                    >
                      {element}
                    </span>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Dropdown;
