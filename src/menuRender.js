/**
 * @fileOverview  Calls for ReactDom to render the menu page
 *
 * @author  Chau Vu
 * @author  Gary Chew
 *
 * @requires  NPM: react, react-dom
 * @requires  ./components/Menu
 * @requires  ../node_modules/bootstrap/dist/css/bootstrap.min.css
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './components/Menu';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<Menu />, document.getElementById('root'));
