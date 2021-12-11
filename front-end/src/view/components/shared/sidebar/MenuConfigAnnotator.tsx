/* eslint-disable import/prefer-default-export */
import React from 'react';

import {
  FaMoneyCheckAlt,
} from 'react-icons/fa';

import { MdOutlineDashboard } from 'react-icons/md';

import { Paths } from '../routes';

export const links = [
  {
    id: 4,
    name: 'Projects',
    href: Paths.Projects,
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
  {
    id: 1,
    name: 'Finances',
    href: Paths.Finances,
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
  },
];
