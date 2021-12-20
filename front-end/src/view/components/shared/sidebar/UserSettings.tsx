import React, { Fragment } from 'react';

import { Menu, Transition } from '@headlessui/react';
import { useUserNotNull } from '../../../../data';

import { useDialog } from '../../../../utils/modals';
import { SignOutDialog, EditProfileDialog } from '../dialogs';

import DownArrow from '../../../../assets/icons/down-arrow.svg';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function UserSettings() {
  const [user] = useUserNotNull();
  const dialog = useDialog();

  return (
    <div className="Dropdown text-black focus:outline-none">
      <Menu as="div" className="flex">
        <Menu.Button>
          <div className="flex items-center gap-3 p-1 text-black bg-blue-50 hover:bg-blue-100 transition-all rounded-full">
            <span className="block h-9 w-9 bg-blue-200 rounded-full" />
            {user ? user.name : 'loading...'}
            <img className="mr-4" src={DownArrow} alt="Profile Options" />
          </div>
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
          <Menu.Items className="origin-top-right absolute right-16 mt-12 px-6 rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 bg-white focus:outline-none">
            <Menu.Item>
              <button className="block pr-16 py-4 text-gray-600 hover:text-black" type="button" onClick={() => dialog.open(<EditProfileDialog onClose={dialog.close} />)}>
                Edit Profile
              </button>
            </Menu.Item>

            <span className="block border-b" />

            <Menu.Item>
              {({ active }) => (
                <a
                  href="./"
                  className={classNames(
                    active ? 'text-black' : 'text-gray-600',
                    'block pr-16 pt-4 pb-2',
                  )}
                >
                  Account Settings
                </a>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <a
                  href="./"
                  className={classNames(
                    active ? 'text-black' : 'text-gray-600',
                    'block pr-16 pb-4',
                  )}
                >
                  Notifications
                </a>
              )}
            </Menu.Item>

            <span className="block border-b" />

            <Menu.Item>
              <button className="block pr-16 py-4 text-red-600 hover:text-black" type="button" onClick={() => dialog.open(<SignOutDialog onClose={dialog.close} />)}>
                Sign Out
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
