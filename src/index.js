import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
import { UserProvider } from './components/UserContext';



const root = ReactDOM.createRoot(document.getElementById('root'));
const token = localStorage.getItem('vostorg-token')
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
axios.defaults.baseURL = "http://127.0.0.1:8000/api"
root.render(
  <UserProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </UserProvider>
);
