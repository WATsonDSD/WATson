import React from 'react';

import {
  Routes,
  Route,
} from 'react-router-dom';

import { AuthProvider, RequireAuth } from '../utils/auth';

import Dashboard from './components/dashboard';
import Authentication from './components/authentication';

export default function App() {
  // Each component that needs authentication to be accessed
  // should be wrapped in the RequiredAuth component, e.g. the dashboard.
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        <Route
          path="/dashboard"
          element={(
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
            )}
        />
      </Routes>
    </AuthProvider>
  );
}
