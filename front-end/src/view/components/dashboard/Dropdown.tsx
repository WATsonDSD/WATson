import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const Dropdown = () => (

  <div className="Dropdown">

    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          <span className="inline-block bg-transparant px-5 py-1 text-1 font-semibold text-white mr-1"><AiTwotoneEdit /></span>
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
              {({ active }) => (
                <a
                  href="/"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  )}
                >
                  Open
                </a>
                // <NavLink
                //   to={href}
                //   // 'bg-gray-200 text-gray-700' if active
                //   className={classNames(
                //     active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                //     'block px-4 py-2 text-sm',
                //   )}
                //    key={id ? `${id}` : ''}
                //   id={id ? `${id}` : ''}
                // >
                //   {icon}
                //   <span className="mx-4 font-medium">{name}</span>
                // </NavLink>
              )}
            </Menu.Item>

          </div>
        </Menu.Items>
      </Transition>
    </Menu>

  </div>

);
export default Dropdown;
