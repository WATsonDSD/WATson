/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  FaHome,
  FaUserFriends,
  FaFolderOpen,
} from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';

export const links = [
  {
    id: 1,
    name: 'Workers',
    href: '/workers',
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
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
];
