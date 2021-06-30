


import React from "react";
import { Link } from 'react-router-dom';
import { authenticationService } from '../_services/authenticationService'



export default class Login extends React.Component {

    constructor(props) {
        super(props);
        if (authenticationService.currentUserValue) {
            this.props.history.push('/')
        }
        this.myusername = React.createRef();
        this.mypassword = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleSubmit(event) {
        event.preventDefault();
        authenticationService.login(this.myusername.current.value, this.mypassword.current.value, this.props.history);

    }

    render() {
        return (

            <div class="row w-100">
                <div class=" card mx-auto col-9 col-md-4 shadow p-3  bg-white rounded">
                    <div class="text-center">
                        <img src="/favicon.ico" id="icon" alt="User Icon" />
                        <h2>Login</h2>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div class="form-group">
                            <input type="text" class="form-control" id="formGroupExampleInput" name="username" placeholder="username" ref={this.myusername} required />
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" id="formGroupExampleInput2" name="password" placeholder="password" ref={this.mypassword} required />
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-dark">Sign in</button>
                        </div>
                    </form>
                    <div >
                        <Link to="/signUp" class="underlineHover float-right">Sign Up</Link>
                    </div>
                </div>
            </div>

        );
    }
}