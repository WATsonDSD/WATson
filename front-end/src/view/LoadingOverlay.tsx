import React, { useEffect, useState } from 'react';
// import Loading from './components/loading';

let loadingSetter: Function | null = null;

export async function load(fn: () => any) {
  loadingSetter?.(true);
  await fn();
  loadingSetter?.(false);
}

export function LoadingOverLay() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadingSetter = setLoading;
    return () => { loadingSetter = null; };
  }, [setLoading]);

  return loading
    ? (
      <div id="loading" className="fixed top-0 left-0 right-0 bottom-0 z-50 w-full h-screen flex items-center justify-center bg-black bg-opacity-25">
        <svg className="loading" viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20" />
        </svg>
      </div>
    )
    : null;
}
