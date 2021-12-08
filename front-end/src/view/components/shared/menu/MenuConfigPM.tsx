/* eslint-disable import/prefer-default-export */
import React from 'react';

import { FiUsers } from 'react-icons/fi';
import { MdOutlineDashboard } from 'react-icons/md';
import { ImStatsBars } from 'react-icons/im';
import { HiOutlineDocumentReport } from 'react-icons/hi';

import { Paths } from '../routes';

export const links = [
  {
    id: 1,
    name: 'Workers',
    href: Paths.Workers,
    icon: <FiUsers className="w-5 h-5" />,
  },
  {
    id: 2,
    name: 'Projects',
    href: Paths.Projects,
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
  {
    id: 3,
    name: 'Statistics',
    href: '/',
    icon: <ImStatsBars className="w-5 h-5" />,
  },
  {
    id: 4,
    name: 'Reports',
    href: '/',
    icon: <HiOutlineDocumentReport className="w-5 h-5" />,
  },
];
