import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User, useUserContext } from '../../../../data';

function openModal(value: boolean, id: string) {
  const modalOverlay = document.querySelector('#modals');
  const modal = document.querySelector(id);
  const modalCl = modal?.classList;
  const overlayCl = modalOverlay;

  if (value) {
    console.log(0);
    overlayCl?.classList.remove('hidden');
    setTimeout(() => {
      modalCl?.remove('opacity-0');
      modalCl?.remove('-translate-y-full');
      modalCl?.remove('scale-150');
      modalCl?.remove('hidden');
    }, 100);
  } else {
    console.log(1);
    modalCl?.add('-translate-y-full');
    setTimeout(() => {
      modalCl?.add('opacity-0');
      modalCl?.add('scale-150');
      modalCl?.add('hidden');
    }, 100);
    setTimeout(() => overlayCl?.classList.add('hidden'), 300);
  }
}

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ');
}

export default function Usersettings() {
  const user = useUserContext() as User;

  return (
    <div className="absolute bottom-0 right-0 px-4 py-3 flex justify-end items-center gap-3">
      <div className="bg-opacity-0 hover:bg-gray-200 px-4 py-2 rounded text-black focus:outline-none">
        <div className="Dropdown">

          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button>
                <div className="inline-block bg-transparant flex px-3 py-0 text-1 font-semibold text-black mr-1">
                  <div className="py-1">
                    {user ? user.name : 'loading...'}
                  </div>
                  <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="avatar" className="h-9 w-9 mx-2 py--1 object-center object-cover rounded-full" />
                </div>
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>

                    <button className="block px-4 py-2 text-sm text-gray-700" type="button" onClick={() => openModal(true, '#edit')}>
                      Edit Profile
                    </button>

                  </Menu.Item>
                  <p className="border-b-2" />
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="./"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Account settings
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="./"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Notifications
                      </a>
                    )}
                  </Menu.Item>
                  <p className="border-b-2 px-4" />
                  <Menu.Item>
                    <button className="block px-4 py-2 text-sm text-gray-700" type="button" onClick={() => openModal(true, '#signoutmodal')}>
                      Sign Out
                    </button>
                  </Menu.Item>

                </div>
              </Menu.Items>
            </Transition>
          </Menu>

        </div>
      </div>
    </div>

  );
}
