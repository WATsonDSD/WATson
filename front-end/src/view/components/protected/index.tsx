import React from 'react';

import {
  Navigate,
} from 'react-router-dom';

import { useUserData } from '../../../data';
import { Paths } from '../shared/routes/paths';

import Loading from '../loading';

export default function Protected({ children }: { children: JSX.Element }) {
  const [user, sessionState] = useUserData();

  if (sessionState === 'pending') {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={Paths.Authentication} />;
  }

  return children;
}
