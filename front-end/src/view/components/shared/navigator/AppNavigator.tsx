import React from 'react';

import {
  Routes,
  Route,
} from 'react-router-dom';

import Protected from '../../protected';

import Authentication from '../../authentication';
import Layout from '../layout/Layout';

export default () => (
  <Routes>
    <Route path="/" element={<Authentication />} />
    <Route
      path="/dashboard"
      element={(
        <Protected>
          <Layout />
        </Protected>
                )}
    />
  </Routes>
);
