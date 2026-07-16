import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// BrowserRouter is what lets us have separate /  and /admin URLs that
// each render a different page, instead of cramming everything onto
// one screen. React Router intercepts link clicks so the page never
// actually reloads — it just swaps the components shown.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
