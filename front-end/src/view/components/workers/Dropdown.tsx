import React, { Fragment, ReactElement } from 'react';

import {
  Menu,
  Transition,
} from '@headlessui/react';

import { Worker } from '../../../data';

import { useDialog } from '../../../utils/modals';
import { AwardBonusDialog, EditUserDialog, DeleteUserDialog } from '../shared/dialogs';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const Dropdown = (props: {user: Worker, icon: ReactElement}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, icon } = props;

  const dialog = useDialog();

  let counter = 0;

  const options = [
    {
      name: 'Edit Worker',
      action: () => {
        dialog.open(<EditUserDialog user={user} onClose={dialog.close} />);
      },
    },
    {
      name: 'Award Bonus',
      action: () => {
        dialog.open(<AwardBonusDialog user={user} onClose={dialog.close} />);
      },
    },
    {
      name: 'Delete User',
      action: () => {
        dialog.open(<DeleteUserDialog user={user} onClose={dialog.close} />);
      },
    },
  ];

  const dropDownOptions = options.map((option: {name: string, action: Function}) => ((
    <button
      id={`${option.name}-btn`}
      className="whitespace-nowrap"
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        option.action();
      }}
    >
      {option.name}
    </button>
  )
  ));

  return (
    <div className="Dropdown justify-self-center text-black focus:outline-none">
      <Menu as="div" className="relative text-left my-0.5 max-h-6">
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
          <Menu.Items className="absolute right-3/4 py-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 bg-white focus:outline-none">
            <div>
              {dropDownOptions.slice(0, -1).map((option) => {
                counter += 1;
                return (
                  <Menu.Item key={counter}>
                    {({ active }) => (
                      <span
                        key={counter}
                        className={classNames(
                          active ? 'text-black' : 'text-gray-600',
                          'block pl-6 pr-12 py-2 text-base font-medium normal-case',
                        )}
                      >
                        {option}
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
                    active ? 'text-red-800 ' : 'text-red-600',
                    'block pl-6 pr-12 py-2 text-base font-medium normal-case',
                  )}
                >
                  {dropDownOptions[dropDownOptions.length - 1]}
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
