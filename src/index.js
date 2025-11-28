import React from 'react';
import ReactDOM from 'react-dom';  // Changed from 'react-dom/client'
import App from './App';

ReactDOM.render(  // Changed from createRoot
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);