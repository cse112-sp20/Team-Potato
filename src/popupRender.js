/**
 * @fileOverview calls ReactDom to render the popup page
 *
 * @author  Gary Chew
 * @author  Chau Vu
 *
 * @requires  NPM: react, react-dom
 * @requires  ./components/Popup
 * @requires  ../node_modules/bootstrap/dist/css/bootstrap.min.css
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './components/Popup';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<Popup />, document.getElementById('root'));
