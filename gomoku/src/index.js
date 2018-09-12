import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Game from './Game'


ReactDOM.render(<Game condition={5} width={20}/>, document.getElementById('root'));
registerServiceWorker();
