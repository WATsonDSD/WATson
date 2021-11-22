import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Authentication from './components/authentication';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Authentication />
      </div>
    </BrowserRouter>
  );
}

export default App;
