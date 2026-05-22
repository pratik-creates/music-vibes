import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

import App from './App';
import { AuthProvider } from './context/AuthContext'; // AuthProvider ko import karein

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* App ko AuthProvider se wrap karein */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);