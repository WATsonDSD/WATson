import React from 'react';
import AppNavigator from './components/shared/navigator/AppNavigator';

export default function App() {
  // Each component that needs authentication to be accessed
  // should be wrapped in the RequiredAuth component, e.g. the dashboard.
  return (
    <AppNavigator />
  );
}
