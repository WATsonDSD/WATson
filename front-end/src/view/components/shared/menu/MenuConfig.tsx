/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  FaHome,
  FaUserFriends,
  FaFolderOpen,
  FaCalendarAlt,
} from 'react-icons/fa';

export const links = [
  {
    id: 1,
    name: 'PageA',
    href: '/pageA',
    icon: <FaHome className="w-5 h-5" />,
  },
  {
    id: 2,
    name: 'PageB',
    href: '/pageB',
    icon: <FaUserFriends className="w-5 h-5" />,
  },
  {
    id: 3,
    name: 'PageC',
    href: '/pageC',
    icon: <FaFolderOpen className="w-5 h-5" />,
  },
  {
    id: 4,
    name: 'Dashboard',
    href: '/dashboard',
    icon: <FaCalendarAlt className="w-5 h-5" />,
  },
];
