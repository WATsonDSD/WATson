import React from 'react';

import workers from '../../../../assets/icons/workers.svg';

export function ProjectsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="4.76" height="4.76" rx="2" fill="white" />
      <rect x="6.12012" width="4.76" height="4.76" rx="2" fill="white" />
      <rect x="12.24" width="4.76" height="4.76" rx="2" fill="white" />
      <rect y="6.12012" width="4.76" height="4.76" rx="2" fill="white" />
      <rect x="6.12012" y="6.12012" width="4.76" height="4.76" rx="2" fill="white" />
      <rect x="12.24" y="6.12012" width="4.76" height="4.76" rx="2" fill="white" />
      <rect y="12.24" width="4.76" height="4.76" rx="2" fill="white" />
      <rect x="6.12012" y="12.24" width="4.76" height="4.76" rx="2" fill="white" />
    </svg>
  );
}

export function WorkersIcon() {
  return workers;
}
