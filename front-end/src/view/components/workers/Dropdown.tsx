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
      <Menu as="div" className="z-10 relative text-left my-0.5 max-h-6">
        <Menu.Button>
          <span className="my-1 block w-auto font-bold px-2 align-middle text-center">{icon}</span>
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
          <Menu.Items className="absolute right-3/4 bg-ui-darkgray rounded-md shadow-lg py-2 focus:outline-none divide-y">
            <div>
              {elements?.slice(0, -1).map((element : ReactElement) => {
                counter += 1;
                return (
                  <Menu.Item key={counter}>
                    {({ active }) => (
                      <span
                        key={counter}
                        className={classNames(
                          active ? 'bg-gray-700 text-white' : 'text-white',
                          'block pl-6 pr-12 py-2 text-base font-medium normal-case',
                        )}
                      >
                        {element}
                      </span>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
            <Menu.Item key={counter}>
              {({ active }) => (
                <span
                  key={counter}
                  className={classNames(
                    active ? 'bg-gray-700 ' : '',
                    'text-ui-darkred block pl-6 pr-12 py-2 text-base font-medium normal-case',
                  )}
                >
                  {elements[elements.length - 1]}
                </span>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Dropdown;
