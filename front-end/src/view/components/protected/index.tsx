import React from 'react';

import {
  useLocation,
  Navigate,
} from 'react-router-dom';

import useAuthentication from '../../../data/authentication';

export default function Protected({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const authentication = useAuthentication();

  if (authentication.isLoading) return (<span>Loading...</span>);

  if (!authentication.user) {
    // Redirects the user to the login page and saves the current location they were
    // trying to access when they were redirected, which makes for nicer user experience.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
}
