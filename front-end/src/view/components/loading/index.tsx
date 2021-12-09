import React from 'react';

import './index.css';

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" />
      </svg>
    </div>
  );
}
