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

      <Menu as="div" className="z-10 relative inline-block text-left">
        <Menu.Button>
          <span className="block p-2 -m-2">{icon}</span>
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
          <Menu.Items className="origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {elements?.map((element : ReactElement) => {
                counter += 1;
                return (
                  <Menu.Item key={counter}>
                    {({ active }) => (
                      <span
                        key={counter}
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        {element}
                      </span>
                    )}
                  </Menu.Item>
                );
              })}

            </div>
          </Menu.Items>
        </Transition>
      </Menu>

    </div>

  );
};

export default Dropdown;
