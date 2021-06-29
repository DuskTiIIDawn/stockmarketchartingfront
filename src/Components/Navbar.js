import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authenticationService } from '../_services/authenticationService';



export default class Navbar extends Component {

    render() {
        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
                    <a class="navbar-brand"> <img src="/favicon.ico" width="30" height="30" /></a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item active"><Link to="/" class="nav-link" >Home</Link></li>
                            {this.props.currentUser && <li class="nav-item"><Link class="nav-link" to="/company" >{this.props.isAdmin && 'Manage'} Company</Link> </li>}
                            {this.props.currentUser && <li class="nav-item"><Link class="nav-link" to="/charts" >Compare Companies</Link></li>}

                            {this.props.isAdmin &&
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Stock Price Data</a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <Link to="/stockPrice/import" class="dropdown-item" >Import Data</Link>
                                        <Link to="/stockPrice/seeData" class="dropdown-item" >See Data</Link>
                                        <div class="dropdown-divider"></div>
                                        <Link to="/stockPrice/missingRecords" class="dropdown-item" >Missing Records</Link>
                                    </div>
                                </li>
                            }
                            {this.props.isAdmin && <li class="nav-item"><Link to="/sector" class="nav-link "> {this.props.isAdmin && 'Manage'} Sector</Link></li>}
                            {this.props.currentUser && <li class="nav-item"><Link to="/ipo" class="nav-link "> {this.props.isAdmin && 'Manage'} IPO</Link></li>}
                            {this.props.isAdmin && <li class="nav-item"><Link to="/stockCode" class="nav-link ">Stock Codes</Link></li>}
                            {this.props.isAdmin && <li class="nav-item"><Link to="/stockExchange" class="nav-link ">Stock Exchange</Link></li>}
                            {!this.props.currentUser && <li class="nav-item"><Link to="/login" class="nav-link ">Login</Link></li>}

                        </ul>

                        {this.props.currentUser &&
                            <ul class="navbar-nav ml-auto">
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><label class="text-white" for="user">Welcome :&nbsp;</label>< input id="user" value={this.props.currentUser?.userName} disabled /></a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <Link to="/user/info" class="dropdown-item">Change Password</Link>
                                        <div class="dropdown-divider"></div>
                                        <button class="nav-link btn btn-warning" onClick={this.props.logout}>Logout</button>
                                    </div>
                                </li>
                            </ul>
                        }

                    </div>
                </nav>
            </div >
        )
    }
}
