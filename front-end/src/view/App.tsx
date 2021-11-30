import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useUserContext } from '../data';
import Authentication from './components/authentication';
import Layout from './components/shared/layout/Layout';
import './App.css';

export default function App() {
  const user = useUserContext();
  if (user === 'isLoading') { return <div>Loading...</div>; }

  if (!user) {
    return <Authentication />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Layout />
      </div>
    </BrowserRouter>
  );
}
