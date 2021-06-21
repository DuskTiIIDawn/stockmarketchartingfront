import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class Navbar extends Component {

    render() {
        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a class="navbar-brand"> <img src="/favicon.ico" width="30" height="30" /></a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item active">
                                <a class="nav-link" >Home <span class="sr-only">(current)</span></a>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" to="/company" >Manage Company</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" to="/charts" >Compare Companies</Link>
                            </li>

                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Stock Price Data
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <Link to="/stockPrice/import" class="dropdown-item" >Import Data</Link>
                                    <Link to="/stockPrice/seeData" class="dropdown-item" >See Data</Link>
                                    <div class="dropdown-divider"></div>
                                    <Link to="/stockPrice/missingRecords" class="dropdown-item" >Missing Records</Link>
                                </div>
                            </li>
                            <li class="nav-item">
                                <Link to="/sector" class="nav-link ">Manage Sector</Link>
                            </li>

                            <li class="nav-item">
                                <Link to="/ipo" class="nav-link "  >Manage IPO</Link>
                            </li>

                            <li class="nav-item">
                                <Link to="/stockCode" class="nav-link ">Stock Codes</Link>
                            </li>

                            <li class="nav-item">
                                <Link to="/stockExchange" class="nav-link ">Stock Exchange</Link>
                            </li>
                        </ul>

                    </div>
                </nav>
            </div >
        )
    }
}
