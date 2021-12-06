import React from 'react';
import ReactDOM from 'react-dom';
import App from './view/App';

import './index.css';
import PageA from './view/components/financier/dummyFinanceView';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <PageA />
  </React.StrictMode>,
  document.getElementById('root'),
);
