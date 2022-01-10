/* eslint-disable import/prefer-default-export */
import React from 'react';

import {
  FaMoneyCheckAlt, FaPen,
} from 'react-icons/fa';

import { MdDomainVerification } from 'react-icons/md';

import { Paths } from '../routes';

export const links = [
  {
    id: 1,
    name: 'Annotate',
    href: `${Paths.Projects}annotate`,
    icon: <FaPen className="w-5 h-5" />,
  },
  {
    id: 2,
    name: 'Verify',
    href: `${Paths.Projects}verify`,
    icon: <MdDomainVerification className="w-5 h-5" />,
  },
  {
    id: 3,
    name: 'Finances',
    href: Paths.Finances,
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
  },
];
