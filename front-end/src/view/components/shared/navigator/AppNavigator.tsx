import React from 'react';

import {
  Routes,
  Route,
} from 'react-router-dom';

import { RequireAuth } from '../../../../utils/auth';

import Dashboard from '../../dashboard';
import Authentication from '../../authentication';

export default () => (
  <Routes>
    <Route path="/" element={<Authentication />} />
    <Route
      path="/dashboard"
      element={(
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
                )}
    />
  </Routes>
);
