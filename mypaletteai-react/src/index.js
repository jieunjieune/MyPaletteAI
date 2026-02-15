import React from 'react';
import { Provider } from "react-redux";
import ReactDOM from 'react-dom/client';
import store from './Store';
import App from './App';
import './components/global/Global.module.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={ store }>
      <App />
  </Provider>
);
