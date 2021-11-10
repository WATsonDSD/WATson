import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Layout from './components/shared/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Layout />
      </div>
    </BrowserRouter>
  );
}

export default App;
