import React from 'react';

export default function PlusIcon(props: { className: string, stroke: string}) {
  const { className, stroke } = props;
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1L6 11M1 6H11" stroke={stroke} strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>

  );
}
