/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  FaMoneyCheckAlt,
} from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';

export const linksVerifier = [
  {
    id: 1,
    name: 'Annotate',
    href: '/dashboard',
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
  {
    id: 2,
    name: 'Verify',
    href: '/dashboard',
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
  {
    id: 3,
    name: 'Finances',
    href: '/dashboard',
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
  },
];
