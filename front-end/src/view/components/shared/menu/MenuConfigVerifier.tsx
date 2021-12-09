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
    href: '/',
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
  {
    id: 2,
    name: 'Verify',
    href: '/',
    icon: <MdOutlineDashboard className="w-5 h-5" />,
  },
  {
    id: 3,
    name: 'Finances',
    href: '/',
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
  },
];
