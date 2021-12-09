/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  FaMoneyCheckAlt,
} from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';

export const links = [
  {
    id: 4,
    name: 'Projects',
    href: '/dashboard',
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
  {
    id: 1,
    name: 'Reports',
    href: '/reportFinance',
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
  },
];
