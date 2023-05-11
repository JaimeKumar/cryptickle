import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import $ from 'jquery';


function resize() {
  $('.bodyCont').css('height', window.screen.availHeight + 'px');
}

window.addEventListener('resize', resize);
resize();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
