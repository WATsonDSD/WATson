import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/shared/layout/Layout';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Layout />
      </div>
    </BrowserRouter>
  );
}
