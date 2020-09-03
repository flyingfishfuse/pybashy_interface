import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

<Arwes background='/static/img/background.jpg' pattern='/static/img/glow.png'
    animate
    pattern='/static/img/glow.png'
    background={{
        small: '/static/img/small.jpg',
        medium: '/static/img/medium.jpg',
        large: '/static/img/large.jpg',
        xlarge: '/static/img/xlarge.jpg'
    }}
>
    <p>Application elements</p>
</Arwes>
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
