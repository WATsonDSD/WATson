/* eslint-disable import/prefer-default-export */
import React from 'react';

import {
  FaMoneyCheckAlt,
} from 'react-icons/fa';

import { MdOutlineDashboard } from 'react-icons/md';

import { Paths } from '../routes';

export const links = [
  {
    id: 1,
    name: 'Annotate',
    href: `${Paths.Projects}annotate`,
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
  {
    id: 2,
    name: 'Verify',
    href: `${Paths.Projects}verify`,
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
  {
    id: 3,
    name: 'Finances',
    href: Paths.Finances,
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
  },
];
