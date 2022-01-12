import React from 'react';

import { FiUsers } from 'react-icons/fi';
import { ImStatsBars } from 'react-icons/im';
import { FaMoneyCheckAlt } from 'react-icons/fa';

import { ProjectsIcon } from './menu-icons';

import { Paths } from '../routes/paths';

export const MenuItems: {[name: string] : { icon: React.ReactElement, href: string }} = {
  Projects: {
    icon: <ProjectsIcon />,
    href: Paths.Projects,
  },
  Workers: {
    icon: <FiUsers className="w-5 h-5" />,
    href: Paths.Workers,
  },
  Statistics: {
    icon: <ImStatsBars className="w-5 h-5" />,
    href: Paths.Statistics,
  },
  Reports: {
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
    href: Paths.Reports,
  },
  Annotate: {
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
    href: `${Paths.Projects}annotate`,
  },
  Verify: {
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
    href: `${Paths.Projects}verify`,
  },
  Finances: {
    icon: <FaMoneyCheckAlt className="w-5 h-5" />,
    href: Paths.Finances,
  },
};

export const MenuConfigurations: {[role: string] : typeof MenuItems} = {
  projectManager: (
    ({ Projects, Workers, Statistics }) => ({ Projects, Workers, Statistics })
  )(MenuItems),
  finance: (
    ({ Projects, Reports }) => ({ Projects, Reports })
  )(MenuItems),
  annotator: (
    ({ Projects, Finances }) => ({ Projects, Finances })
  )(MenuItems),
  verifier: (
    ({ Annotate, Verify, Finances }) => ({ Annotate, Verify, Finances })
  )(MenuItems),
};
