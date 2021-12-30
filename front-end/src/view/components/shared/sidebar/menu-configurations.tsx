import React from 'react';

import { ProjectsIcon, WorkersIcon } from './menu-icons';

import { Paths } from '../routes/paths';

export const MenuItems: {[name: string] : { icon: React.ReactElement, href: string }} = {
  Projects: {
    icon: <ProjectsIcon />,
    href: Paths.Projects,
  },
  Workers: {
    icon: <WorkersIcon />,
    href: Paths.Workers,
  },
  Statistics: {
    icon: <ProjectsIcon />,
    href: Paths.Statistics,
  },
};

export const MenuConfigurations: {[role: string] : typeof MenuItems} = {
  projectManager: (
    ({ Projects, Workers, Statistics }) => ({ Projects, Workers, Statistics })
  )(MenuItems),
};
