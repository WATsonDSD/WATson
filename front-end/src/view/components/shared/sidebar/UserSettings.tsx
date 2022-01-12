import React, { Fragment } from 'react';

import { Menu, Transition } from '@headlessui/react';
import { useUserNotNull } from '../../../../data';

import { useDialog } from '../../../../utils/modals';
import { SignOutDialog, EditProfileDialog, AccountSettings } from '../dialogs';

import LogoutIcon from '../../../../assets/icons/signout.svg';
import ProfileIcon from '../../../../assets/icons/profile.svg';
import DownArrow from '../../../../assets/icons/down-arrow.svg';
import AccountSettingsIcon from '../../../../assets/icons/account_settings.svg';

export default function UserSettings() {
  const [user] = useUserNotNull();
  const dialog = useDialog();

  return (
    <div className="Dropdown text-black focus:outline-none">
      <Menu as="div" className="flex">
        <Menu.Button className="opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-x-2 text-black rounded-full">
            <p>{user ? user.name : 'loading...'}</p>
            <img src={DownArrow} alt="Profile Options" />
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
          <Menu.Items className="origin-top-right absolute right-16 flex flex-col items-start gap-y-4 mt-10 px-6 py-5 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 bg-white focus:outline-none">
            <Menu.Item>
              <button className="block flex items-center gap-x-3 pr-8 text-gray-600 opacity-80 hover:opacity-100 transition-opacity" type="button" onClick={() => dialog.open(<EditProfileDialog onClose={dialog.close} />)}>
                <img src={ProfileIcon} className="w-5" alt="Edit profile" />
                Edit Profile
              </button>
            </Menu.Item>

            <Menu.Item>
              <button className="block flex items-center gap-x-3 pr-8 text-gray-600 opacity-80 hover:opacity-100 transition-opacity" type="button" onClick={() => dialog.open(<AccountSettings onClose={dialog.close} />)}>
                <img src={AccountSettingsIcon} className="w-5" alt="Account settings" />
                Account Settings
              </button>
            </Menu.Item>

            <span className="block w-full border-b" />

            <Menu.Item>
              <button className="block flex items-center gap-x-3 pr-8 text-red-600 opacity-80 hover:opacity-100 transition-opacity" type="button" onClick={() => dialog.open(<SignOutDialog onClose={dialog.close} />)}>
                <img src={LogoutIcon} className="w-5" alt="Logout" />
                Logout
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
