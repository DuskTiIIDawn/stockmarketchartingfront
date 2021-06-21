import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Components/Main';
import './Styles/stylesheet.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/jquery/dist/jquery';
import '../node_modules/popper.js/dist/popper';
import 'font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap-select/dist/css/bootstrap-select.min.css';
import '../node_modules/bootstrap-select/dist/js/bootstrap-select.min.js';




import { BrowserRouter } from 'react-router-dom';



window.base_url = 'http://localhost:8080';

ReactDOM.render(<BrowserRouter><Main /></BrowserRouter>, document.getElementById('root'));